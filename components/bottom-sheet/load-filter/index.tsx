import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { CustomBadgeSelector } from '@/components/custom';
import { OPTIONS } from '@/utils/constants';
import { useBottomSheet } from '@/hooks/context/bottom-sheet';

export interface LoadFilterBottomSheetRef {
  open: () => void;
  close: () => void;
}

const LoadFilterBottomSheet = forwardRef<LoadFilterBottomSheetRef>((_, ref) => {
  
  const { selectedFilters, onFilterChange, closeLoadFilter } = useBottomSheet();

  const { isDarkMode, theme } = useTheme();
  const { t } = useTranslation();
  
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%'], []);
  const booleanFiltersData = OPTIONS['boolean-filters'];

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
            {t('more-filters')}
          </Text>

        <CustomBadgeSelector
						items={booleanFiltersData}
						selectedItems={Object.keys(selectedFilters).filter(key => selectedFilters[key as any])}
            isStatic
						onChange={(value) => {
              onFilterChange(value)
              closeLoadFilter()
            }}
					/>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default LoadFilterBottomSheet;
