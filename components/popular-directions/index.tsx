import React from 'react';
import { View, Text } from 'react-native';

interface DirectionItemProps {
  from: string;
  to: string;
  totalAds: number;
  todayAds: number;
}

const PopularDirections: React.FC<DirectionItemProps> = ({ from, to, todayAds, totalAds }) => {
  return (
    <View className="p-4 mb-4 bg-white rounded-lg shadow-md">
    {/* Cities */}
        <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-bold">{from}</Text>
            <Text className="text-lg font-bold text-gray-500">→</Text>
            <Text className="text-lg font-bold">{to}</Text>
        </View>

        {/* Details */}
        <Text className="text-sm text-center text-primary">
            Всего {totalAds} объявлений, {todayAds} из них сегодняшние
        </Text>
  </View>
  );
};

export default PopularDirections;
