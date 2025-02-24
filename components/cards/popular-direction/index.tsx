import React from 'react';
import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { getCityName } from '@/utils/general';
import { useTranslation } from 'react-i18next';
import { DirectionItemProps } from '@/interface/components';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeContext';

const PopularDirection: React.FC<DirectionItemProps> = ({ origin, destination, today_loads, total_loads }) => {
  const { t } = useTranslation();
  const { theme, themeName } = useTheme();
  
  return (
    <Link href={`/search?arrival=${getCityName(origin)}&departure=${getCityName(destination)}`} className='flex-1 w-full px-6 py-4 border-t bg-primary-light dark:bg-primary-dark/80 border-border-color dark:border-border-color/20'>
      <View className="flex-row items-center flex-1 w-full">
        <View className="flex items-center justify-center bg-purple-600 w-14 h-14 rounded-2xl">
          <View className="flex items-center justify-center w-10 h-10 bg-white rounded-full">

              <Ionicons name="location" size={20} color={theme.colors.purple} />
          </View>
        </View>
        <View className="flex-col items-center flex-1 w-full mb-0 ml-5">
          <View className='flex flex-row items-center self-start gap-2'>
            <Text className="text-lg font-medium text-primary-purple">
              {getCityName(origin)}
            </Text>
            <Ionicons name="arrow-forward" size={12} color={theme.colors[themeName === 'dark' ? 'light' : 'dark']}/>
            <Text className="text-lg font-medium text-primary-purple">
              {getCityName(destination)}
            </Text>
          </View>
          <View className='self-start flex-1 w-full pl-px'>
            <Text className="text-sm font-medium text-primary-descr-color">
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
