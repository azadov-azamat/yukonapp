import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import RuIcon from "@/assets/svg/ru.svg";
import UzIcon from "@/assets/svg/uz.svg";
import UzCyrlIcon from "@/assets/svg/uz-Cyrl.svg";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

const languages = [
    { code: "ru", label: "Русский", icon: RuIcon },
    { code: "uz", label: "O‘zbekcha", icon: UzIcon },
    { code: "uz-Cyrl", label: "Ўзбекча", icon: UzCyrlIcon },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "uz");
  
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['30%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleOpen = useCallback(() => bottomSheetRef.current?.expand(), []);

  let currentLang = languages.find((lang) => lang.code === currentLanguage);
  
  // Change Language
  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setCurrentLanguage(code);
    // setIsDropdownOpen(false);
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        enableTouchThrough={true}
        // style={{zIndex: 0}}
      />
    ),
    []
  );
  
  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        className="absolute flex items-center justify-center w-12 h-12 bg-gray-200 border-2 rounded-md top-2 right-2 border-border-color"
        style={{ zIndex: 1 }}
      >
        {currentLang?.icon && (
          <currentLang.icon width={32} height={32} />
        )}
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        // backdropComponent={renderBackdrop}
        // backgroundStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        handleIndicatorStyle={{ backgroundColor: '#000'}}
        style={{ zIndex: 1000000 }}
      >
        <BottomSheetView className="flex-1 bg-white z-[1000000]">
          {languages.map((item, index) => (
            <TouchableOpacity 
              key={item.code} 
              onPress={() => handleLanguageChange(item.code)} 
              className={`flex-row items-center p-4 ${index !== languages.length - 1 ? 'border-b border-border-color' : ''}`}
            >
              <item.icon width={24} height={24} />
              <Text className="ml-3 text-base">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default LanguageSelector;
