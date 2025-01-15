import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoadCardProps {
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  weight: string;
  cargoType: string;
  price: string;
  createdAt: string;
  onBookmark: () => void;
}

const LoadCard: React.FC<LoadCardProps> = ({
  originCity,
  originCountry,
  destinationCity,
  destinationCountry,
  weight,
  cargoType,
  price,
  createdAt,
  onBookmark,
}) => {
  return (
    <View className="p-4 mb-4 bg-white shadow-md rounded-xl">
      {/* Top Row */}
      <View className="flex-row items-center justify-between mb-4">
        {/* Cargo Type and Weight */}
        <View className="flex-row items-center space-x-2">
          <Text className="font-bold text-gray-700 underline">{cargoType}</Text>
          <Ionicons name="car" size={16} color="#6b7280" />
          <View className="px-3 py-1 rounded-full bg-primary">
            <Text className="text-sm text-white">{weight}</Text>
          </View>
        </View>

        {/* Telegram and Bookmark Buttons */}
        <View className="flex-row items-center space-x-3">
          <View className="px-3 py-1 rounded-full bg-primary">
            <Text className="text-sm text-white">Telegram</Text>
          </View>
          <TouchableOpacity
            onPress={onBookmark}
            className="items-center justify-center w-6 h-6 bg-gray-200 rounded-full"
          >
            <Ionicons name="bookmark-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Origin and Destination */}
      <View className="flex-row items-center justify-between my-4">
        {/* Origin */}
        <View className="items-start flex-1">
          <Text className="text-lg font-bold">{originCity}</Text>
          <Text className="text-gray-500">{originCountry}</Text>
        </View>

        {/* Path Line */}
        <View className="h-[2px] bg-gradient-to-r from-blue-400 to-transparent flex-1 mx-4" />

        {/* Destination */}
        <View className="items-end flex-1">
          <Text className="text-lg font-bold">{destinationCity}</Text>
          <Text className="text-gray-500">{destinationCountry}</Text>
        </View>
      </View>

      {/* Bottom Row */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
        {/* Created At */}
        <View className="flex-row items-center space-x-2">
          <Ionicons name="calendar" size={16} color="#9ca3af" />
          <Text className="text-sm text-gray-500">{createdAt}</Text>
        </View>

        {/* Price */}
        <View className="flex-row items-center space-x-2">
          <Text className="text-lg font-bold text-primary">{price}</Text>
          <Ionicons name="cash-outline" size={20} color="#2563eb" />
        </View>
      </View>
    </View>
  );
};

export default LoadCard;
