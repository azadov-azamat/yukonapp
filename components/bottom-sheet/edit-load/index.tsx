import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { RelativePathString, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CustomBadgeSelector, CustomButton, CustomInput, CustomInputSelector, MultiSelectDropdown } from "@/components/custom";
import { ICountryModel } from '@/interface/redux/variable.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getName } from '@/utils/general';
import { fetchCountries } from "@/redux/reducers/country";
import { getCities } from "@/redux/reducers/city";
import { capitalize } from 'lodash';

export interface EditLoadBottomSheetRef {
  open: () => void;
  close: () => void;
}

type EditLoadBottomSheetProps = {
  recordId: number | null;  // Accept recordId as a prop
};

const EditLoadBottomSheet = forwardRef<EditLoadBottomSheetRef, EditLoadBottomSheetProps>(({ recordId }, ref) => {
  const router = useRouter();
  const { isDarkMode, toggleTheme, themeName, theme } = useTheme();
  const { i18n, t } = useTranslation();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['87%'], []);

	const currentLanguage = i18n.language;

	const dispatch = useAppDispatch();
  const { allCountries, countries, loading: countryLoading } = useAppSelector((state) => state.country);
  const { cities, loading: cityLoading } = useAppSelector((state) => state.city);

	const [originCountry, setOriginCountry] = React.useState<ICountryModel | null>(null); // Initialize with "" to avoid null
	const [destinationCountry, setDestinationCountry] = React.useState<ICountryModel | null>(null); // Initialize with "" to avoid null
	const [originCity, setOriginCity] = React.useState<ICountryModel | null>(null);
	const [destinationCity, setDestinationCity] = React.useState<ICountryModel | null>(null);
	const [destinationCities, setDestinationCities] = React.useState<ICountryModel[]>([]);

  const [selectedType, setType] = React.useState('load');

  React.useEffect(()=> {
    dispatch(fetchCountries());
  }, []);


  const adTypes = [
    { value: 'load', label: t('bookmarks.load'), icon: 'cube-outline' as const},
    { value: 'vehicle', label: t('bookmarks.vehicle'), icon: 'car-outline' as const},
  ];

	const handleCountryChange = async (item: any) => {
    setOriginCountry(item);
    await dispatch(getCities({countryId: item.id}));
  }

	const handleDestinationCountryChange = async (item: any) => {
    setDestinationCountry(item);
    const response = await dispatch(getCities({countryId: item.id}));
    setDestinationCities(response.payload); // Access the payload property
  }

  const handleCityChange = (item: any) => setOriginCity(item);
  const handleDestinationCityChange = (item: any) => setDestinationCity(item);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
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

	function onClearOriginCountry() {
    setOriginCountry(null);
		setOriginCity(null);
  }

	function onClearDestinationCountry() {
    setDestinationCountry(null);
  }

  function onClearOriginCity() {
    setOriginCity(null);
  }

	function onClearDestinationCity() {
    setDestinationCity(null);
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: isDarkMode ? theme.colors.dark : theme.colors.light,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? '#9CA3AF' : '#6B7280',
      }}
    >
      <BottomSheetView className="flex-1 dark">
        <View className="p-4">
          <Text className="pb-2 text-3xl font-bold text-black dark:text-white">
						{recordId === 0 ? t('pages.create-add') : t('pages.just-edit')}
          </Text>

					<View className="pt-4">
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
                      selectedType === type.value ? 'bg-slate-200 border-indigo-500' : 'bg-slate-100 border-transparent'
                    }`}
                  >
                    {type.icon && (
                      <Ionicons
                        name={type.icon}
                        size={24}
                        color={selectedType === type.value ? '#6366f1' : '#94a3b8'}
                        style={{ marginRight: 8 }}
                      />
                    )}
                    <Text
                      className={`text-base font-medium capitalize ${
                        selectedType === type.value ? 'text-indigo-500' : 'text-slate-400'
                      }`}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text className="mt-2 text-lg font-semibold text-gray-700 dark:text-white">
              {t ("where-from")}
            </Text>
						<View className="pt-4">
  						<CustomInputSelector
  							value={originCountry}
  							onChange={handleCountryChange}
                onSearch={(query: string, items: any[]) => items.filter(item => item.names.includes(query.toLowerCase()))}
  							placeholder='select-country'
  							loading={countryLoading}
  							items={allCountries}
  							labelField={`name${capitalize(currentLanguage)}`}
  							valueField="id"
  							search={true}
  							onClear={onClearOriginCountry}
  							rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
  						/>
						</View>
            <View className="pt-4">
              <CustomInputSelector
                value={originCity}
                onChange={handleCityChange}
                onSearch={(query: string, items: any[]) => items.filter(item => item.names.includes(query.toLowerCase()))}
                placeholder='select-city'
                loading={cityLoading}
                disabled={!originCountry}
                items={cities}
                labelField={`name${capitalize(currentLanguage)}`}
                valueField="id"
                search={true}
                onClear={onClearOriginCity}
                rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
              />
            </View>

						<Text className="mt-4 text-lg font-semibold text-gray-700 dark:text-white">
              {t ("where-to")}
            </Text>
						<View className="pt-4">
  						<CustomInputSelector
  							value={destinationCountry}
  							onChange={handleDestinationCountryChange}
                onSearch={(query: string, items: any[]) => items.filter(item => item.names.includes(query.toLowerCase()))}
  							placeholder='select-country'
  							loading={countryLoading}
								disabled={!originCountry}
  							items={allCountries}
  							labelField={`name${capitalize(currentLanguage)}`}
  							valueField="id"
  							search={true}
  							onClear={onClearDestinationCountry}
  							rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
  						/>
						</View>
            <View className="pt-4">
							<CustomInputSelector
  							value={destinationCity}
  							onChange={handleDestinationCityChange}
                onSearch={(query: string, items: any[]) => items.filter(item => item.names.includes(query.toLowerCase()))}
  							placeholder='select-city'
  							loading={cityLoading}
								disabled={!destinationCountry}
  							items={destinationCities}
  							labelField={`name${capitalize(currentLanguage)}`}
  							valueField="id"
  							search={true}
  							onClear={onClearDestinationCity}
  							rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
  						/>
            </View>
					</View>

        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default EditLoadBottomSheet;
