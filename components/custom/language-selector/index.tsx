import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import RuIcon from "@/assets/svg/ru.svg";
import UzIcon from "@/assets/svg/uz.svg";
import UzCyrlIcon from "@/assets/svg/uz-Cyrl.svg";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const languages = [
    { code: "ru", label: "Русский", icon: RuIcon },
    { code: "uz", label: "O‘zbekcha", icon: UzIcon },
    { code: "uz-Cyrl", label: "Ўзбекча", icon: UzCyrlIcon },
];

const LanguageSelector = ({view = 'dropdown'}) => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "uz");
  
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['32%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleOpen = useCallback(() => bottomSheetRef.current?.expand(), []);

  let currentLang = languages.find((lang) => lang.code === currentLanguage);
  
  // Change Language
  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setCurrentLanguage(code);
    setIsDropdownOpen(false);
    bottomSheetRef.current?.close();
  };

  return (
    view === 'dropdown' ? <View className="relative">
      {/* Dropdown Trigger */}
      <TouchableOpacity
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center w-12 h-12 bg-gray-200 border-2 rounded-md border-border-color"
      >

        {currentLang?.icon && (
          <currentLang.icon width={32} height={32} />
        )}
      </TouchableOpacity>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <View className="absolute right-0 z-[1000] w-32 bg-white rounded-md shadow-md top-14">
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleLanguageChange(item.code)}
                className="flex-row items-center flex-1 p-3 border-b border-gray-200"
              >
                <View style={{ marginRight: 8 }}>
                  <item.icon width={24} height={24} />
                </View>
                <Text className="text-base">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View> : (
      <View className="absolute top-0 bottom-0 left-0 right-0 items-end flex-1 m-2">
        <TouchableOpacity
          onPress={handleOpen}
          className="flex items-center justify-center w-12 h-12 bg-gray-200 border-2 rounded-md border-border-color"
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
        >
          <BottomSheetView className="flex-1">
            
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
      </View>
    )
  );
};

export default LanguageSelector;
