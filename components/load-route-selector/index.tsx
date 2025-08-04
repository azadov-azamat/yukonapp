import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { itemCityProps } from '@/interface/redux/variable.interface';
import { getCityName } from '@/utils/general';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/config/ThemeContext';

interface LoadRouteSelectorProps {
  origin: itemCityProps | null;
  destination: itemCityProps | null;
  onClear: () => void; // Yonalishlarni o'chirish uchun
  onSwapCities: () => void; // Shaharlarni almashtirish uchun
  openLoadFilter: () => void; // Shaharlarni almashtirish uchun
}

const LoadRouteSelector: React.FC<LoadRouteSelectorProps> = ({
  origin,
  destination,
  onClear,
  onSwapCities,
  openLoadFilter
}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  return (
    <View className="relative flex-row items-center justify-between px-4 py-2 overflow-visible shadow-lg bg-primary-light dark:bg-primary-dark rounded-xl dark:border border-border-color/20">
      {/* Origin */}
      <TouchableOpacity
        onPress={onClear}
      >
        <Ionicons name="chevron-back-outline" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      <View className="items-start ">
        {/* <Text className="text-gray-500">{t ('table.origin-city')}</Text> */}
        <Text className="text-lg font-bold text-primary-dark dark:text-primary-light">{getCityName(origin)}</Text>
      </View>

      {/* Path Line */}
      <View className="absolute top-[50%] left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-transparent to-blue-400 opacity-30" />

      {/* Swap Button */}
      <TouchableOpacity
        onPress={onSwapCities}
        disabled={!destination}
        className="z-10 items-center justify-center w-10 h-10 mx-2 border rounded-full bg-primary-light dark:bg-primary-dark border-border-color/20"
      >
        <Ionicons name="swap-horizontal" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Destination */}
      <View className="items-end ">
        {/* <Text className="text-gray-500">{t ('table.destination-city')}</Text> */}
        <Text className="text-lg font-bold text-primary-dark dark:text-primary-light">
          {getCityName(destination)}
        </Text>
      </View>

      {/* Clear Button */}
      <TouchableOpacity onPress={openLoadFilter}>
        <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
        {/* <Ionicons name="close" size={14} color="white" /> */}
      </TouchableOpacity>
    </View>
  );
};

export default LoadRouteSelector;
