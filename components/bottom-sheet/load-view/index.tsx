import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { LoadGridCard } from '@/components/cards';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { ButtonBookmark } from '@/components/buttons';

interface LoadViewItemProps {
  recordId: number | null;
}

export interface LoadViewBottomSheetRef {
  open: () => void;
  close: () => void;
}

const LoadViewBottomSheet = forwardRef<LoadViewBottomSheetRef, LoadViewItemProps>(({ recordId }, ref) => {
  const { isDarkMode, theme } = useTheme();
  const { t } = useTranslation();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['100%'], []);
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
          <View className="relative flex-row items-center justify-center">
            <Text className="text-lg font-bold">{t('load')}</Text>
            <View className="absolute right-0">
              <ButtonBookmark model={load} paramName='bookmarkedLoadIds' className='!bg-transparent'/>
            </View>
          </View>
          
          <LoadGridCard load={load} showElement isUpdate/>
          </View>}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default LoadViewBottomSheet;
