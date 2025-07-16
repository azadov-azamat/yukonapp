import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { RelativePathString, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '@/redux/reducers/auth';
import { useAppDispatch } from '@/redux/hooks';
import { useBottomSheet } from '@/hooks/context/bottom-sheet';
import { CustomBadgeSelector } from '@/components/custom';
import { OPTIONS } from '@/utils/constants';

export interface DirectionChangeBottomSheetRef {
  open: () => void;
  close: () => void;
}

const DirectionChangeBottomSheet = forwardRef<DirectionChangeBottomSheetRef>((_, ref) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isDarkMode, toggleTheme, themeName, theme } = useTheme();
  const { i18n, t } = useTranslation();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const { languages } = useBottomSheet();
  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    bottomSheetRef.current?.close();
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  const handleThemeToggle = () => {
    toggleTheme();
    // Reload the app after theme change
    setTimeout(() => {
      router.replace('/');
    }, 100);
  };

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

  const truckTypes = OPTIONS['truck-types'].filter(item => item.value !== 'not_specified');
  
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
            {t('profile.settings')}
          </Text>

         {/* <CustomBadgeSelector
            items={truckTypes}
            selectedItems={selectedItems}
            onChange={handleBadgeChange}
          /> */}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default DirectionChangeBottomSheet;
