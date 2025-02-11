import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import RuIcon from "@/assets/svg/ru.svg";
import UzIcon from "@/assets/svg/uz.svg";
import UzCyrlIcon from "@/assets/svg/uz-Cyrl.svg";

const languages = [
    { code: "ru", label: "Русский", icon: RuIcon },
    { code: "uz", label: "O‘zbekcha", icon: UzIcon },
    { code: "uz-Cyrl", label: "Ўзбекча", icon: UzCyrlIcon },
];

const LanguageSelector = ({view = 'dropdown'}) => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "uz");
  
  let currentLang = languages.find((lang) => lang.code === currentLanguage);
  
  // Change Language
  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code); // Change the language
    setCurrentLanguage(code);
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
    </View> : <View>
      
    </View>
  );
};

export default LanguageSelector;
