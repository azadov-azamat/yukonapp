import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Available languages
  const languages = [
    { code: "uz-cyrl", label: "Ўзбекча (Кирилл)" },
    { code: "ru", label: "Русский" },
    { code: "uz", label: "O‘zbekcha" },
  ];

  // Change Language
  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code); // Change the language
    setIsDropdownOpen(false); // Close dropdown
  };

  return (
    <View className="relative">
      {/* Dropdown Trigger */}
      <TouchableOpacity
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-48 p-3 bg-gray-200 rounded-md"
      >
        <Text className="text-base font-semibold">{t("common:selectLanguage")}</Text>
      </TouchableOpacity>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <View className="absolute left-0 z-10 w-48 bg-white rounded-md shadow-md top-14">
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleLanguageChange(item.code)}
                className="p-3 border-b border-gray-200"
              >
                <Text className="text-base">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default LanguageSelector;
