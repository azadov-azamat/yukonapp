import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { itemCityProps } from '@/interface/redux/variable.interface';

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
  return (
    <View className="relative flex-row items-center justify-between p-4 bg-white shodow-lg rounded-xl">
      {/* Origin */}
      <View className="items-start flex-1">
        <Text className="text-gray-500">Отправления</Text>
        <Text className="text-lg font-bold">{origin?.name_uz}</Text>
      </View>

      {/* Path Line */}
      <View className="absolute top-[50%] left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-transparent to-blue-400 opacity-30" />

      {/* Swap Button */}
      <TouchableOpacity
        onPress={onSwapCities}
        className="z-10 items-center justify-center w-10 h-10 mx-4 bg-white border border-blue-400 rounded-full"
      >
        <Ionicons name="swap-horizontal" size={24} color="#2563eb" />
      </TouchableOpacity>

      {/* Destination */}
      <View className="items-end flex-1">
        <Text className="text-gray-500">Назначения</Text>
        <Text className="text-lg font-bold">
          {destination?.name_uz || 'Не указано'}
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
