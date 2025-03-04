import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dateFromNow, formatPrice, getCityCountryName } from '@/utils/general';
import LoadModel from '@/models/load';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { loadCardInterfaceProps } from '@/interface/components';

const LoadCard = ({load, onPress, showElement = false, showIcon = false, changes = false }: loadCardInterfaceProps) => {
  const {user} = useAppSelector(state => state.auth);
  const {t} = useTranslation();

  const ParentComponent = showElement ? View : TouchableOpacity;

  return (
    <ParentComponent
    {...(!showElement && { onPress })}
		className={`flex-col items-start justify-between p-4 bg-primary-light dark:bg-primary-dark border-border-color dark:border-border-color/20 border-t relative ${changes ? 'mt-2 rounded-lg px-4 py-2 border-t-0' : ''}`}>
    {/* Left Side: Origin and Destination */}
		{showIcon && (
			<View className='absolute top-0 right-0 mx-2 my-2'>
				<Ionicons name="cube" size={18} color="#2563eb" />
			</View>
		)}
    <View className="flex-1">
      <Text className="text-lg font-bold text-primary-title-color dark:text-primary-light">
      	<Text className="text-lg font-bold">{getCityCountryName(load, 'origin')}</Text>
        <Text className="text-lg font-bold"> - {getCityCountryName(load, 'destination')}</Text>
      </Text>
    </View>

    <View className="flex-row items-center justify-between flex-1 w-full mt-1">
    <View className="flex-row items-center">
        <Text className="text-sm text-border-color/40">{t ('truck-type.' + load.cargoType)}</Text>
        <TouchableOpacity className="ml-2">
          <Text className="font-bold text-primary">{t (load.isWebAd ? 'site' : 'telegram')}</Text>
        </TouchableOpacity>
      </View>

      <View className="items-end">
      <Text className="text-sm text-border-color">{dateFromNow(load.createdAt || '')}</Text>
    </View>
    </View>
  </ParentComponent>
  );
};

export default LoadCard;
