import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import AdsFormComponent from '@/components/forms/ads-form';
import { Ionicons } from '@expo/vector-icons';
import { clearLoad } from '@/redux/reducers/load';
import { clearVehicle } from '@/redux/reducers/vehicle';
import { useAppDispatch } from '@/redux/hooks';

export interface EditFormBottomSheetRef {
  open: () => void;
  close: () => void;
}

type EditFormBottomSheetProps = {
  recordId: number | null;
  model: 'load' | 'vehicle';
};

const EditFormBottomSheet = forwardRef<EditFormBottomSheetRef, EditFormBottomSheetProps>(({ recordId, model = 'load' }, ref) => {
  const dispatch = useAppDispatch();
  const { isDarkMode, theme } = useTheme();
  const { t } = useTranslation();
  
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['100%'], []);

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.expand(),
    close: () => bottomSheetRef.current?.close(),
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
          <View className='flex-1 px-4'>
            <View className='flex-row items-center justify-between'>
              <Text className='text-2xl font-bold text-primary-black dark:text-primary-light'>
                {t(recordId === 0 ? 'pages.create-add' : 'pages.just-edit')}
              </Text>
              <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
                <Ionicons name='close-circle-outline' size={24} color={theme.colors.primary}/>
              </TouchableOpacity>
			      </View>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
				      <AdsFormComponent recordId={recordId && recordId !== 0 ? recordId : 0} close={() => {
                bottomSheetRef.current?.close()
                dispatch(model === 'load' ? clearLoad() : clearVehicle());
                }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default EditFormBottomSheet;
