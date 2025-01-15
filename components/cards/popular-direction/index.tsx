import { DirectionItemProps } from '@/interface/components';
import React from 'react';
import { View, Text } from 'react-native';

const PopularDirection: React.FC<DirectionItemProps> = ({ origin, destination, today_loads, total_loads }) => {
  return (
    <View className="p-4 mb-4 bg-white rounded-lg shadow-md">
    {/* Cities */}
        <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-bold">{origin.name_uz}</Text>
            <Text className="text-lg font-bold text-gray-500">→</Text>
            <Text className="text-lg font-bold">{destination.name_ru}</Text>
        </View>

        {/* Details */}
        <Text className="text-sm text-center text-primary">
            Всего {total_loads} объявлений, {today_loads} из них сегодняшние
        </Text>
  </View>
  );
};

export default PopularDirection;
