import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import AdsFormComponent from '@/components/forms/ads-form';
import { Ionicons } from '@expo/vector-icons';


export interface EditLoadBottomSheetRef {
  open: () => void;
  close: () => void;
}

type EditLoadBottomSheetProps = {
  recordId: number | null;
};

const EditLoadBottomSheet = forwardRef<EditLoadBottomSheetRef, EditLoadBottomSheetProps>(({ recordId }, ref) => {
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
          <View style={{ padding: 16, flex: 1 }}>
            <View className='flex-row items-center justify-between'>
				<Text style={{ paddingBottom: 8, fontSize: 24, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>
				{recordId === 0 ? t('pages.create-add') : t('pages.just-edit')}
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
				      <AdsFormComponent recordId={recordId && recordId !== 0 ? recordId : 0} close={() => bottomSheetRef.current?.close()} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default EditLoadBottomSheet;
