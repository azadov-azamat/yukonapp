import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dateFromNow, formatPrice, getCityName } from '@/utils/general';
import LoadModel from '@/models/load';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { loadCardInterfaceProps } from '@/interface/components';

const LatestLoadCard = ({load, onPress, showElement = false}: loadCardInterfaceProps) => {
  const {user} = useAppSelector(state => state.auth);
  const {t} = useTranslation();

  const ParentComponent = showElement ? View : TouchableOpacity;

  return (
    <ParentComponent
    {...(!showElement && { onPress })}
    className="flex-col items-start justify-between px-5 py-3 bg-white border-t border-slate-300">
    <View className="flex-1">
      <Text className="text-lg font-semibold text-gray-700">
      	<Text>{getCityName(load?.originCity)}</Text>
        <Text> - {getCityName(load.destinationCity)}</Text>
      </Text>
    </View>

    <View className="flex-row items-center justify-between flex-1 w-full mt-2">
    <View className="flex-row items-center">
        <Text className="text-sm text-gray-600">{t ('truck-type.' + load.cargoType)}</Text>
        <TouchableOpacity className="ml-2">
          <Text className="text-sm font-bold text-blue-600">{t (load.isWebAd ? 'site' : 'telegram')}</Text>
        </TouchableOpacity>
      </View>

      <View className="items-end">
      <Text className="text-sm text-gray-600">{dateFromNow(load.publishedDate || load.createdAt || '')}</Text>
    </View>
    </View>
  </ParentComponent>
  );
};

export default LatestLoadCard;
