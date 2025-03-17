import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import i18n from '@/utils/i18n';
import RuIcon from "@/assets/svg/ru.svg";
import UzIcon from "@/assets/svg/uz.svg";
import UzCyrlIcon from "@/assets/svg/uz-Cyrl.svg";

export const languages = [
  { code: "ru", label: "Русский", icon: RuIcon, short: "ru" },
  { code: "uz", label: "O‘zbekcha", icon: UzIcon, short: "uz" },
  { code: "uz-Cyrl", label: "Ўзбекча", icon: UzCyrlIcon, short: "Ўз" },
];

export interface LanguageBottomSheetRef {
  open: () => void;
  close: () => void;
}

  const LanguageBottomSheet = forwardRef<LanguageBottomSheetRef>((_, ref) => {
  const { isDarkMode, theme } = useTheme();
  
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%'], []);

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.expand(),
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    bottomSheetRef.current?.close();
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
        {languages.map((item, index) => (
            <TouchableOpacity 
              key={item.code} 
              onPress={() => handleLanguageChange(item.code)} 
              className={`flex-row items-center p-4 ${index !== languages.length - 1 ? 'border-b border-border-color dark:border-border-color/20' : ''}`}
            >
              <item.icon width={24} height={24} />
              <Text className="ml-3 text-base text-primary-black dark:text-primary-light">{item.label}</Text>
            </TouchableOpacity>
          ))}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default LanguageBottomSheet;
