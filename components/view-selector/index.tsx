import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ViewSelectorProps } from '@/interface/components';
import { useTranslation } from 'react-i18next';

const ViewSelector: React.FC<ViewSelectorProps> = ({ tabs, selectedTab, onTabSelect }) => {
  const {t} = useTranslation();
  
  return (
    <View className="flex-row items-center justify-center w-full mb-4 space-x-2">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          onPress={() => onTabSelect(tab.value)}
          className={`flex-1 flex-row justify-center items-center px-4 py-2 rounded-full ${
            selectedTab === tab.value ? 'bg-primary' : 'bg-gray-500'
          }`}
        >
          {tab.icon && (
            <Ionicons
              name={tab.icon}
              size={24}
              color="white"
              style={{ marginRight: 8 }}
            />
          )}
          <Text className="text-base font-bold text-white capitalize">{t (tab.label)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ViewSelector;
