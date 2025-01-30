import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "ru", label: "Русский", icon: require("@/assets/svg/ru.svg") },
    { code: "uz", label: "O‘zbekcha", icon: require("@/assets/svg/uz.svg") },
    { code: "uz-Cyrl", label: "Ўзбекча", icon: require("@/assets/svg/uz-Cyrl.svg") },
];

const LanguageSelector = ({view = 'dropdown'}) => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    i18n.language || "uz"
  );
  
  let currentLang = languages.find((lang) => lang.code === currentLanguage);
  
  // Change Language
  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code); // Change the language
    currentLang = languages.find((lang) => lang.code === code);
    setIsDropdownOpen(false); // Close dropdown
  };

  return (
    view === 'dropdown' ? <View className="relative">
      {/* Dropdown Trigger */}
      <TouchableOpacity
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center w-12 h-12 bg-gray-200 border-2 rounded-md border-border-color"
      >
        {currentLang?.icon && (
          <Image
            source={currentLang.icon}
            className="w-8 h-8"
            resizeMode="contain"
          />
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
                <Image
                    source={item.icon}
                    className="w-6 h-6 mr-2"
                    resizeMode="contain"
                />
                <Text className="text-base">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View> : <View>
      
    </View>
  );
};

export default LanguageSelector;
