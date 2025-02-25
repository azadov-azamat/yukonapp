import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { LoadGridCard } from '@/components/cards';

interface LoadVehicleViewItemProps {
  recordId: number | null;
}

export interface LoadVehicleViewBottomSheetRef {
  open: () => void;
  close: () => void;
}

const LoadVehicleViewBottomSheet = forwardRef<LoadVehicleViewBottomSheetRef, LoadVehicleViewItemProps>(({ recordId }, ref) => {
  const { isDarkMode, theme } = useTheme();
  const { t } = useTranslation();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);
  const {load} = useAppSelector(state => state.load);
  
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
      <BottomSheetView className="flex-1">
        {load && <View className="px-2">
          <LoadGridCard load={load} showElement isUpdate/>
          </View>}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default LoadVehicleViewBottomSheet;
