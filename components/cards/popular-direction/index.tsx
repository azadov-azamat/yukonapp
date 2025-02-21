import React from 'react';
import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { getCityName } from '@/utils/general';
import { useTranslation } from 'react-i18next';
import { DirectionItemProps } from '@/interface/components';
import { Ionicons } from '@expo/vector-icons';

const PopularDirection: React.FC<DirectionItemProps> = ({ origin, destination, today_loads, total_loads }) => {
  const { t } = useTranslation();

  return (
    <Link href={`/search?arrival=${getCityName(origin)}&departure=${getCityName(destination)}`} className='flex-1 w-full px-6 py-4 bg-white border-t border-slate-300'>
      <View className="flex-row items-center flex-1 w-full">
        <View className="flex items-center justify-center w-14 h-14 bg-purple-600 rounded-2xl">
          <View className="flex items-center justify-center w-10 h-10 bg-white rounded-full">

              <Ionicons name="location" size={20} color="#9333ea" />
          </View>
        </View>
        <View className="flex-col items-center flex-1 w-full mb-0 ml-5">
          <View className='flex flex-row gap-2 items-center self-start'>
            <Text className="text-lg font-medium text-purple-700">
              {getCityName(origin)}
            </Text>
            <Ionicons name="arrow-forward" size={12} />
            <Text className="text-lg font-medium text-purple-700">
              {getCityName(destination)}
            </Text>
          </View>
          <View className='flex-1 w-full self-start pl-px'>
            <Text className="text-sm font-medium text-slate-700">
              {t ("top-searches-result", {
                  count: total_loads,
                  todayCounter: today_loads
                }
              )}
            </Text>
          </View>
        </View>
      </View>
    </Link>
  );
};

export default PopularDirection;
