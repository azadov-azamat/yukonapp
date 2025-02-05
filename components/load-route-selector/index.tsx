import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { itemCityProps } from '@/interface/redux/variable.interface';
import { getCityName } from '@/utils/general';
import { useTranslation } from 'react-i18next';

interface LoadRouteSelectorProps {
  origin: itemCityProps | null;
  destination: itemCityProps | null;
  onClear: () => void; // Yonalishlarni o'chirish uchun
  onSwapCities: () => void; // Shaharlarni almashtirish uchun
}

const LoadRouteSelector: React.FC<LoadRouteSelectorProps> = ({
  origin,
  destination,
  onClear,
  onSwapCities,
}) => {
  const {t} = useTranslation();
  return (
    <View className="relative flex-row items-center justify-between p-4 mt-2 overflow-visible bg-white shodow-lg rounded-xl">
      {/* Origin */}
      <View className="items-start flex-1">
        <Text className="text-gray-500">{t ('table.origin-city')}</Text>
        <Text className="text-lg font-bold">{getCityName(origin)}</Text>
      </View>

      {/* Path Line */}
      <View className="absolute top-[50%] left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-transparent to-blue-400 opacity-30" />

      {/* Swap Button */}
      <TouchableOpacity
        onPress={onSwapCities}
        disabled={!destination}
        className="z-10 items-center justify-center w-10 h-10 mx-4 bg-white border border-blue-400 rounded-full"
      >
        <Ionicons name="swap-horizontal" size={24} color="#2563eb" />
      </TouchableOpacity>

      {/* Destination */}
      <View className="items-end flex-1">
        <Text className="text-gray-500">{t ('table.destination-city')}</Text>
        <Text className="text-lg font-bold">
          {getCityName(destination)}
        </Text>
      </View>

      {/* Clear Button */}
      <TouchableOpacity
        onPress={onClear}
        className="absolute right-0 items-center justify-center w-6 h-6 bg-red-500 rounded-full -top-2"
      >
        <Ionicons name="close" size={14} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default LoadRouteSelector;
