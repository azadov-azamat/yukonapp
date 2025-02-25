import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { RelativePathString, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CustomBadgeSelector, CustomButton, CustomInput, CustomInputSelector } from "@/components/custom";
import { vehicleCountriesProps } from '@/interface/redux/variable.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getName } from '@/utils/general';

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
  const snapPoints = useMemo(() => ['100%'], []);

	const currentLanguage = i18n.language;

	const dispatch = useAppDispatch();
  const { allCountries, countries, loading } = useAppSelector((state) => state.country);

	const [orirginCountry, setOriginCountry] = React.useState<vehicleCountriesProps | null>(null); // Initialize with "" to avoid null
	const [selectedCity, setSelectedCity] = React.useState<vehicleCountriesProps | null>(null);

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
        <View className="pt-4">
          <Text className="px-4 pb-2 text-3xl font-bold text-black dark:text-white">
						Edit Load - {recordId !== null ? `ID: ${recordId}` : 'No ID Selected'}
          </Text>

					<View className="pt-4">
						<View className="pt-4">
						<CustomInputSelector
							value={orirginCountry}
							onChange={handleCountryChange}
							placeholder='loads.origin-country'
							// error={error}
							loading={loading}
							items={allCountries}
							labelField={'name_' + currentLanguage}
							valueField="id"
							search={false}
							onClear={onClearOriginCountry}
							rightData={(item) => <View className='flex-row items-center justify-center px-1 rounded-md bg-primary'>
								<Ionicons name='car' size={18} color={'white'} className=''/>
								<Text className='ml-1 text-xs text-white'>{item.vehicle_count}</Text>
							</View>}
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
