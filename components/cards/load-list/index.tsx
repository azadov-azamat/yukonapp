import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dateFromNow, formatPrice, getCityName } from '@/utils/general';
import LoadModel from '@/models/load';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { loadCardInterfaceProps } from '@/interface/components';

const LoadCard = ({load, onPress, showElement = false}: loadCardInterfaceProps) => {
  const {user} = useAppSelector(state => state.auth);
  const {t} = useTranslation();
  
  const ParentComponent = showElement ? View : TouchableOpacity;
  
  return (
    <ParentComponent
    {...(!showElement && { onPress })} 
    className="flex-col items-start justify-between px-4 py-2 mb-4 bg-white rounded-lg shadow-sm">
    {/* Left Side: Origin and Destination */}
    <View className="flex-1">
      <Text className="text-lg font-bold text-gray-800">
      <Text className="text-lg font-bold">{getCityName(load?.originCity)}</Text>
        <Text className="text-lg font-bold"> - {getCityName(load.destinationCity)}</Text>
      </Text>
    </View>

    <View className="flex-row items-center justify-between flex-1 w-full mt-1">
    <View className="flex-row items-center">
        <Text className="text-sm text-gray-600">{t ('truck-type.' + load.cargoType)}</Text>
        <TouchableOpacity className="ml-2">
          <Text className="font-bold text-blue-600">{t (load.isWebAd ? 'site' : 'telegram')}</Text>
        </TouchableOpacity>
      </View>

      <View className="items-end">
      <Text className="text-sm text-gray-600">{dateFromNow(load.publishedDate || load.createdAt || '')}</Text>
    </View>
    </View>
  </ParentComponent>
  );
};

export default LoadCard;
