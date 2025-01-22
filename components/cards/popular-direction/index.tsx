import React from 'react';
import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { getCityName } from '@/utils/general';
import { useTranslation } from 'react-i18next';
import { DirectionItemProps } from '@/interface/components';

const PopularDirection: React.FC<DirectionItemProps> = ({ origin, destination, today_loads, total_loads }) => {
  const { t } = useTranslation();

  return (
    <Link href={`/search?arrival=${getCityName(origin)}&departure=${getCityName(destination)}`} className='flex-1 w-full p-4 mb-4 bg-white rounded-lg shadow-md'>
        <View className="flex-row items-center justify-between flex-1 w-full mb-2">
              <Text className="text-lg font-bold">{getCityName(origin)}</Text>
              <Text className="text-lg font-bold text-gray-500">→</Text>
              <Text className="text-lg font-bold">{getCityName(destination)}</Text>
        </View>

         <View className='flex-1 w-full '>
           {/* Details */}
           <Text className="text-sm text-center text-primary">
            {t ("top-searches-result", {
                count: total_loads, 
                todayCounter: today_loads
              }
            )}
          </Text>
         </View>
  </Link>
  );
};

export default PopularDirection;
