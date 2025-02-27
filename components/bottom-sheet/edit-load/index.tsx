import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { CustomInput, CustomInputSelector, MultiSelectDropdown } from "@/components/custom";
import { ICountryModel, ICityModel } from '@/interface/redux/variable.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getName } from '@/utils/general';
import { fetchCountries } from "@/redux/reducers/country";
import { getLoadById, updateLoad, createLoad } from '@/redux/reducers/load';
import { getCities } from "@/redux/reducers/city";
import { capitalize } from 'lodash';
import { ILoadModel } from "@/interface/redux/load.interface";
import { loadValidationSchema } from '@/validations/form';
import { Formik } from 'formik';
import * as Yup from 'yup';

export interface EditLoadBottomSheetRef {
  open: () => void;
  close: () => void;
}

type EditLoadBottomSheetProps = {
  recordId: number | null;
};


const screenHeight = Dimensions.get("window").height;
const BOTTOM_SHEET_HEIGHT = screenHeight * 0.87; // 87% of screen height
const HEADER_HEIGHT = 80; // Adjust based on actual header height
const FOOTER_HEIGHT = 60; // Adjust if there's a submit button at the bottom
const SCROLLABLE_HEIGHT = BOTTOM_SHEET_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;

// Define Yup validation schema
const validationSchema = Yup.object().shape({
  goods: Yup.string().required('Goods are required'),
  phone: Yup.string().required('Phone is required'),
  truckType: Yup.string().required('Truck type is required'),
  weight: Yup.number().required('Weight is required').positive('Weight must be positive'),
  originCountry: Yup.object().nullable().required('Origin country is required'),
  destinationCountry: Yup.object().nullable().required('Destination country is required'),
  originCity: Yup.object().nullable().required('Origin city is required'),
  destinationCity: Yup.object().nullable().required('Destination city is required'),
});

const EditLoadBottomSheet = forwardRef<EditLoadBottomSheetRef, EditLoadBottomSheetProps>(({ recordId }, ref) => {
  const { isDarkMode, toggleTheme, themeName, theme } = useTheme();
  const { i18n, t } = useTranslation();
	const dispatch = useAppDispatch();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);
	const currentLanguage = i18n.language;

  const { allCountries, countries, loading: countryLoading } = useAppSelector((state) => state.country);
  const [originCities, setOriginCities] = React.useState<ICityModel[]>([]);
  const [destinationCities, setDestinationCities] = React.useState<ICityModel[]>([]);
  const [originLoading, setOriginLoading] = React.useState(false);
  const [destinationLoading, setDestinationLoading] = React.useState(false);

	const [initialValues, setInitialValues] = React.useState({
    goods: '',
    phone: '',
    truckType: '',
    weight: '',
    originCountry: null,
    destinationCountry: null,
    originCity: null,
    destinationCity: null,
  });

	const [text, setText] = React.useState('');
  const [selectedType, setType] = React.useState('load');
	const formikRef = React.useRef<any>(null);

	React.useEffect(() => {
		dispatch(fetchCountries()); // ✅ Call once

		if (recordId && recordId !== 0) {
			dispatch(getLoadById(recordId.toString())).then((response: any) => {
				if (response.payload) {
					setInitialValues((prev) => ({
						...prev, // ✅ Update only if values are different
						goods: response.payload.goods || '',
						phone: response.payload.phone || '',
						truckType: response.payload.cargoType || '',
						weight: response.payload.weight?.toString() || '',
						originCountry: response.payload.originCountry || null,
						destinationCountry: response.payload.destinationCountry || null,
						originCity: response.payload.originCity || null,
						destinationCity: response.payload.destinationCity || null,
					}));
				}
			});
		}
	}, [recordId]);

  const adTypes = [
    { value: 'load', label: t('bookmarks.load'), icon: 'cube-outline' as const},
    { value: 'vehicle', label: t('bookmarks.vehicle'), icon: 'car-outline' as const},
  ];

	const handleCountryChange = async (
    item: ICountryModel,
    setFieldValue: (field: string, value: any) => void,
    setCities: (cities: ICityModel[]) => void,
    setLoading: (loading: boolean) => void
  ) => {
    setFieldValue('originCountry', item);
    setLoading(true);
    const response = await dispatch(getCities({ countryId: item.id }));
    if (response.payload) {
      setCities(response.payload);
    }
    setLoading(false);
  };

	const handleDestinationCountryChange = async (
		item: ICountryModel,
		setFieldValue: (field: string, value: any) => void,
		setCities: (cities: ICityModel[]) => void,
		setLoading: (loading: boolean) => void
	) => {
		setFieldValue('destinationCountry', item);
		setLoading(true);
		const response = await dispatch(getCities({ countryId: item.id }));
		if (response.payload) {
			setCities(response.payload);
		}
		setLoading(false);
	};

	const handleCityChange = (
		item: ICityModel,
		setFieldValue: (field: string, value: any) => void
	) => {
		setFieldValue('originCity', item);
	};

	const handleDestinationCityChange = (
		item: ICityModel,
		setFieldValue: (field: string, value: any) => void
	) => {
		setFieldValue('destinationCity', item);
	};

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.expand(),
    close: () => {
      bottomSheetRef.current?.close();
      resetFormValues();
    },
  }));

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

	const sortedOriginCities = useMemo(() => {
		if (!originCities || originCities.length === 0) return [];

		return [...originCities].sort((a, b) => {
			const field = `name${capitalize(currentLanguage)}`;
			return a[field]?.localeCompare(b[field]);
		});
	}, [originCities, currentLanguage]);

	const sortedDestinationCities = useMemo(() => {
		if (!destinationCities || destinationCities.length === 0) return [];

		return [...destinationCities].sort((a, b) => {
			const field = `name${capitalize(currentLanguage)}`;
			return a[field]?.localeCompare(b[field]);
		});
	}, [destinationCities, currentLanguage]);


	function onClearOriginCountry(setFieldValue: (field: string, value: any) => void) {
		setFieldValue('originCountry', null);
		setFieldValue('originCity', null);
	}

	function onClearDestinationCountry(setFieldValue: (field: string, value: any) => void) {
		setFieldValue('destinationCountry', null);
		setFieldValue('destinationCity', null);
	}

	function onClearOriginCity(setFieldValue: (field: string, value: any) => void) {
		setFieldValue('originCity', null);
	}

	function onClearDestinationCity(setFieldValue: (field: string, value: any) => void) {
		setFieldValue('destinationCity', null);
	}

	const resetFormValues = () => {
		setInitialValues({
			goods: '',
			phone: '',
			truckType: '',
			weight: '',
			originCountry: null,
			destinationCountry: null,
			originCity: null,
			destinationCity: null,
		});
		setType('load'); // Reset ad type selection
		formikRef.current?.resetForm(); // Reset Formik form values
	};

  const renderCustomInputSelector = (label: string, value: any, onChange: any, onClear: any, items: any[], loading: boolean, disabled: boolean) => (
    <CustomInputSelector
      value={value}
      onChange={onChange}
      onSearch={(query: string, items: any[]) => items.filter(item => item.names.includes(query.toLowerCase()))}
      placeholder={`select-${label}`}
      loading={loading}
      disabled={disabled}
      items={items}
      labelField={`name${capitalize(currentLanguage)}`}
      valueField="id"
      search={true}
      onClear={onClear}
      rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
    />
  );

  const renderCustomInput = (label: string, value: string, onChangeText: (text: string) => void) => (
    <CustomInput
      label={t(`loads.${label}`)}
      value={value}
      onChangeText={onChangeText}
      divClass='mt-4'
    />
  );

  return (
    <BottomSheet
			style={{ flex: 1 }}
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: isDarkMode ? theme.colors.dark : theme.colors.light,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? '#9CA3AF' : '#6B7280',
      }}
    >
      <BottomSheetView style={{ flex: 1, backgroundColor: isDarkMode ? theme.colors.dark : theme.colors.light }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ padding: 16, flex: 1 }}>
            <Text style={{ paddingBottom: 8, fontSize: 24, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>
              {recordId === 0 ? t('pages.create-add') : t('pages.just-edit')}
            </Text>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                 onSubmit={async (values, { resetForm }) => {
                 const loadData: ILoadModel = {
                   id: recordId === 0 ? null : recordId,
                   url: '',
                   originCityName: values.originCity || '',
                   destinationCityName: values.destinationCity || '',
                   price: 0,
                   distance: 0,
                   distanceSeconds: 0,
                   phone: values.phone,
                   telegram: '',
                   goods: values.goods,
                   cargoType: values.truckType,
                   cargoType2: 'not_specified',
                   paymentType: 'not_specified',
                   description: '',
                   loadReadyDate: '',
                   loadingSide: '',
                   customsClearanceLocation: '',
                   weight: parseFloat(values.weight) || 0,
                   isDagruz: false,
                   hasPrepayment: false,
                   isLikelyOwner: false,
                   isArchived: false,
                   isDeleted: false,
                   openMessageCounter: 0,
                   phoneViewCounter: 0,
                   prepaymentAmount: 0,
                   expirationButtonCounter: 0,
                   publishedDate: null,
                   loading: false,
                   isWebAd: true,
                   originCity: values.originCity || undefined,
                   originCountry: values.originCountry || undefined,
                   destinationCity: values.destinationCity || undefined,
                   destinationCountry: values.destinationCountry || undefined,
                   createdAt: new Date().toISOString(),
                   updatedAt: new Date().toISOString(),
                 };

                 if (recordId === 0) {
                   await dispatch(createLoad(loadData));
                 } else {
                   await dispatch(updateLoad({ id: recordId, ...loadData }));
                 }

                 bottomSheetRef.current?.close();
   							 resetFormValues();
               }}
              >
                {({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
                  <View style={{ flex: 1 }}>
                    <View className="pt-4">
                      <Text className="pb-2 text-lg font-semibold text-gray-700 dark:text-white">
                        Ad type
                      </Text>
                      <View className="flex-row items-center w-full mb-4 space-x-4">
                        {adTypes.map((type) => (
                          <TouchableOpacity
                            key={type.value}
                            onPress={() => setType(type.value)}
                            className={`flex-1 flex-row  justify-center items-center px-4 py-3 rounded-xl border ${
                              selectedType === type.value ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-100 border-transparent'
                            }`}
                          >
                            {type.icon && (
                              <Ionicons
                                name={type.icon}
                                size={24}
                                color={selectedType === type.value ? '#fff' : '#94a3b8'}
                                style={{ marginRight: 8 }}
                              />
                            )}
                            <Text
                              className={`text-base font-medium capitalize ${
                                selectedType === type.value ? 'text-white' : 'text-slate-400'
                              }`}
                            >
                              {type.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text className="mt-2 text-lg font-semibold text-gray-700 dark:text-white">
                        {t ("where-from")}
                      </Text>
                      <View className="pt-4">
                        {renderCustomInputSelector('country', values.originCountry, (item: ICountryModel) => handleCountryChange(item, setFieldValue, setOriginCities, setOriginLoading), () => onClearOriginCountry(setFieldValue), allCountries, countryLoading, false)}
                      </View>
                      <View className="pt-4">
                        {renderCustomInputSelector('city', values.originCity, (item: ICityModel) => handleCityChange(item, setFieldValue), () => onClearOriginCity(setFieldValue), sortedOriginCities, originLoading, !values.originCountry)}
                      </View>

                      <Text className="mt-4 text-lg font-semibold text-gray-700 dark:text-white">
                        {t ("where-to")}
                      </Text>
                      <View className="pt-4">
                        {renderCustomInputSelector('country', values.destinationCountry, (item: ICountryModel) => handleDestinationCountryChange(item, setFieldValue, setDestinationCities, setDestinationLoading), () => onClearDestinationCountry(setFieldValue), allCountries, countryLoading, !values.originCountry)}
                      </View>
                      <View className="pt-4">
                        {renderCustomInputSelector('city', values.destinationCity, (item: ICityModel) => handleDestinationCityChange(item, setFieldValue), () => onClearDestinationCity(setFieldValue), sortedDestinationCities, destinationLoading, !values.destinationCountry)}
                      </View>
                    </View>

                    {renderCustomInput('goods', values.goods, handleChange('goods'))}
                    {renderCustomInput('phone', values.phone, handleChange('phone'))}
                    {renderCustomInput('truck-type', values.truckType, handleChange('truckType'))}
                    {renderCustomInput('weight', values.weight, handleChange('weight'))}
                  </View>
                )}
              </Formik>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default EditLoadBottomSheet;
