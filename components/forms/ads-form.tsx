import {  Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ICountryModel } from '@/interface/redux/variable.interface'
import { Formik } from 'formik'
import { capitalize } from 'lodash';
import { ICityModel } from '@/interface/redux/variable.interface';
import { getCities } from '@/redux/reducers/city';
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useTranslation } from 'react-i18next';
import { fetchCountries } from '@/redux/reducers/country';
import { createLoad, updateLoad, getLoadById } from '@/redux/reducers/load';
import { ILoadModel } from '@/interface/redux/load.interface';
import { getName } from '@/utils/general';
import { CustomButton, CustomInput, CustomInputSelector } from '../custom';
import { adsValidationSchema } from '@/validations/form';
import { Ionicons } from '@expo/vector-icons';
import { OPTIONS } from '@/utils/constants';
import LoadModel from '@/models/load';
import { LoadSerializer } from '@/serializers';

const AdsFormComponent: React.FC<{recordId: number, close?: () => void}> = ({recordId, close}) => {
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    
    
    const { allCountries, countries, loading: countryLoading } = useAppSelector((state) => state.country);
    const [originCities, setOriginCities] = React.useState<ICityModel[]>([]);
    const [destinationCities, setDestinationCities] = React.useState<ICityModel[]>([]);
    const [originLoading, setOriginLoading] = React.useState(false);
    const [destinationLoading, setDestinationLoading] = React.useState(false);
    const [truckTypes, setTruckTypes] = React.useState(OPTIONS['truck-types']);
    
    const currentLanguage = i18n.language;

    const [loadModel, setLoadModel] = React.useState<LoadModel>(new LoadModel({}));

    const [initialValues, setInitialValues] = React.useState({
      goods: '',
      phone: '',
      truckType: '',
      weight: '',
      originCountry: null,
      destinationCountry: null,
      originCity: null,
      destinationCity: null,
      currency: 'UZS',
      price: '',
      loadReadyDate: '',
      description: '',
    });
  
    const [selectedAdType, setSelectedAdType] = React.useState('load');
    const formikRef = React.useRef<any>(null);
  
    const [prepayment, setPrepayment] = React.useState(false);
    const [prepaymentPercentage, setPrepaymentPercentage] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [prepaymentAmount, setPrepaymentAmount] = React.useState('');

    React.useEffect(() => {
        dispatch(fetchCountries());

        if (recordId !== 0) {
            dispatch(getLoadById(recordId.toString())).then((response: any) => {
                if (response.payload) {
                    const model = new LoadModel(response.payload);
                    setLoadModel(response.payload);
                }
            });
        }

        if (price && prepaymentPercentage) {
            const calculatedAmount = (parseFloat(price) * parseFloat(prepaymentPercentage) / 100).toFixed(2);
            setPrepaymentAmount(calculatedAmount);
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
        setLoading: (loading: boolean) => void,
        field: string
    ) => {
        setFieldValue(field, item);
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
        
    const sortedOriginCities = React.useMemo(() => {
		if (!originCities || originCities.length === 0) return [];

		return [...originCities].sort((a, b) => {
			const field = `name${capitalize(currentLanguage)}`;
			return a[field]?.localeCompare(b[field]);
		});
	}, [originCities, currentLanguage]);

	const sortedDestinationCities = React.useMemo(() => {
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
    
    const renderCustomInput = (label: string, value: string, onChangeText: (text: string) => void) => (
        <CustomInput
          label={t(`loads.${label}`)}
          value={value}
          onChangeText={onChangeText}
          divClass='mt-4'
        />
      );

      
    const renderCustomInputSelector = (
        label: string,
        placeholder: string,
        value: any,
        onChange: any,
        onClear: any,
        items: any[],
        loading: boolean,
        disabled: boolean,
        labelField: string,
        valueField: string,
        searchFunction?: (query: string, items: any[]) => any[],
        rowItem?: (item: any) => JSX.Element
    ) => (
        <CustomInputSelector
            label={label}
            value={value}
            onChange={onChange}
            onSearch={searchFunction}
            placeholder={placeholder}
            loading={loading}
            disabled={disabled}
            items={items}
            labelField={labelField}
            valueField={valueField}
            search={true}
            onClear={onClear}
            rowItem={rowItem || ((item) => <Text>{getName(item, labelField)}</Text>)}
        />
    );

      const resetFormValues = () => {
        const newModel = new LoadModel({});
        setLoadModel(newModel);
        formikRef.current?.resetForm();
    };
      
  return (
    <Formik
    innerRef={formikRef}
    initialValues={loadModel}
    // validationSchema={adsValidationSchema}
    enableReinitialize
     onSubmit={async (values, { resetForm }) => {
     const updatedModel = new LoadModel({
       ...loadModel,
       ...values,
       id: recordId === 0 ? null : recordId,
     });

     console.log("values", LoadSerializer.serialize(updatedModel));
     console.log("updateLoad", updatedModel);
     
    //  if (recordId === 0) {
    //    await dispatch(createLoad(updatedModel));
    //  } else {
    //    await dispatch(updateLoad({ id: recordId, ...updatedModel }));
    //  }

     close?.();
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
                onPress={() => setSelectedAdType(type.value)}
                className={`flex-1 flex-row  justify-center items-center px-4 py-3 rounded-xl border ${
                  selectedAdType === type.value ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-100 border-transparent'
                }`}
              >
                {type.icon && (
                  <Ionicons
                    name={type.icon}
                    size={24}
                    color={selectedAdType === type.value ? '#fff' : '#94a3b8'}
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text
                  className={`text-base font-medium capitalize ${
                    selectedAdType === type.value ? 'text-white' : 'text-slate-400'
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
            {renderCustomInputSelector('country', t('select-country'), values.originCountry, (item: ICountryModel) => handleCountryChange(item, setFieldValue, setOriginCities, setOriginLoading, 'originCountry'), () => onClearOriginCountry(setFieldValue), allCountries, countryLoading, false, 'name', 'id', (query, items) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase())))}
          </View>
          <View className="pt-4">
            {renderCustomInputSelector('city', t('select-city'), values.originCity, (item: ICityModel) => handleCityChange(item, setFieldValue), () => onClearOriginCity(setFieldValue), sortedOriginCities, originLoading, !values.originCountry, 'name', 'id', (query, items) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase())))}
          </View>

          <Text className="mt-4 text-lg font-semibold text-gray-700 dark:text-white">
            {t ("where-to")}
          </Text>
          <View className="pt-4">
            {renderCustomInputSelector('country', t('select-country'), values.destinationCountry, (item: ICountryModel) => handleDestinationCountryChange(item, setFieldValue, setDestinationCities, setDestinationLoading), () => onClearDestinationCountry(setFieldValue), allCountries, countryLoading, !values.originCountry, 'name', 'id', (query, items) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase())))}
          </View>
          <View className="pt-4">
            {renderCustomInputSelector('city', t('select-city'), values.destinationCity, (item: ICityModel) => handleDestinationCityChange(item, setFieldValue), () => onClearDestinationCity(setFieldValue), sortedDestinationCities, destinationLoading, !values.destinationCountry, 'name', 'id', (query, items) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase())))}
          </View>
        </View>

        {renderCustomInput('goods', values.goods, handleChange('goods'))}
        {renderCustomInput('phone', values.phone, handleChange('phone'))}

        <View className="pt-4">
            <Text className="mt-4 mb-1.5 text-lg font-semibold text-gray-700 dark:text-white">
                {t ("loads.truck-type")}
            </Text>
            {renderCustomInputSelector(
            t('loads.truck-type'),
            t('loads.truck-type'),
            values.cargoType,
            handleChange('cargoType'),
            () => setFieldValue('cargoType', ''),
            OPTIONS['truck-types'],
            false,
            false,
            'label',
            'value',
            (query: string, items: any[]) => items.filter((item: any) => item.label.toLowerCase().includes(query.toLowerCase())),
            (item) => <Text>{t(item.label)}</Text>
            )}
        </View>
        {renderCustomInput('weight', values.weight.toString(), handleChange('weight'))}

        <View className="flex-row items-end space-x-2">
          <View className="flex-1">
            {renderCustomInput('price', price, (text) => setPrice(text))}
          </View>
          <View className="w-24">
            {renderCustomInputSelector(
                'currency',
                t('loads.currency'), 
                values.currency,
                handleChange('currency'),
                () => setFieldValue('currency', ''),
                OPTIONS['currencies'],
                false,
                false,
                'label',
                'value',
                undefined,
                (item) => <Text>{item}</Text>
            )}
          </View>
        </View>
        {renderCustomInput('loadReadyDate', values.loadReadyDate, handleChange('loadReadyDate'))}
        {renderCustomInput('description', values.description, handleChange('description'))}

        <View className="pt-4">
            <TouchableOpacity onPress={() => setPrepayment(!prepayment)}>
                <Text>{t('prepayment')}</Text>
            </TouchableOpacity>
            {prepayment && (
                <>
                    {renderCustomInput('prepaymentPercentage', prepaymentPercentage, (text) => setPrepaymentPercentage(text))}
                    <Text>{t('prepaymentAmount')}: {prepaymentAmount}</Text>
                </>
            )}
        </View>
        <CustomButton onPress={handleSubmit} title={t('save')} />
      </View>
    )}
    </Formik>
  )
}

export default AdsFormComponent;
