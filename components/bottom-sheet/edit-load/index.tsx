import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { RelativePathString, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CustomBadgeSelector, CustomButton, CustomInput, CustomInputSelector } from "@/components/custom";
import { ICountryModel } from '@/interface/redux/variable.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getName } from '@/utils/general';
import { fetchCountries } from "@/redux/reducers/country";
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
  const { allCountries, countries, loading } = useAppSelector((state) => state.country);

	const [orirginCountry, setOriginCountry] = React.useState<ICountryModel | null>(null); // Initialize with "" to avoid null
	const [selectedCity, setSelectedCity] = React.useState<ICountryModel | null>(null);
  const [selectedType, setType] = React.useState('load');

  React.useEffect(()=> {
    dispatch(fetchCountries());
  }, []);


  const adTypes = [
    { value: 'load', label: t('bookmarks.load'), icon: 'cube'},
    { value: 'vehicle', label: t('bookmarks.vehicle'), icon: 'car'},
  ];

	const handleCountryChange = (item: any) => setOriginCountry(item);
  const handleCityChange = (item: any) => setSelectedCity(item);

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
    setOriginCountry(null)
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

						<View className="h-screen pt-4">
  						<CustomInputSelector
  							value={orirginCountry}
  							onChange={handleCountryChange}
                onSearch={(query, items) => items.filter(item => item.names.includes(query.toLowerCase()))} // ✅ Custom search
  							placeholder='loads.origin-country'
  							// error={error}
  							loading={loading}
  							items={allCountries}
  							labelField={`name${capitalize(currentLanguage)}`}
  							valueField="id"
  							search={true}
  							onClear={onClearOriginCountry}
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
