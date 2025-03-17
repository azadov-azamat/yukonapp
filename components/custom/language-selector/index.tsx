import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import {  useBottomSheet } from "@/hooks/context/bottom-sheet";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const { openLanguage, languages } = useBottomSheet();
  
  let currentLang = languages.find((lang) => lang.code === i18n.language);
  
  return (
    <>
      <TouchableOpacity
        onPress={openLanguage}
        className="flex-row items-center justify-center w-[70px] h-10 bg-primary-bg-light dark:bg-primary-bg-dark rounded-3xl text-sm"
        style={{ zIndex: 1 }}
      >
        {currentLang?.icon && (
          <View className="object-contain object-center w-6 h-6 overflow-hidden rounded-full">
            <currentLang.icon width={24} height={24} />
          </View>
        )}
        <Text className="ml-2 text-primary-black dark:text-primary-light">{currentLang?.short.toUpperCase()}</Text>
      </TouchableOpacity>
    </>
  );
};

export default LanguageSelector;
