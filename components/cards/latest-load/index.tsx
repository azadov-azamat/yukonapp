import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dateFromNow, getCityName } from '@/utils/general';
import { useTranslation } from 'react-i18next';
import { loadCardInterfaceProps } from '@/interface/components';

const LatestLoadCard = ({load, onPress, showElement = false}: loadCardInterfaceProps) => {
  const {t} = useTranslation();

  const ParentComponent = showElement ? View : TouchableOpacity;

  return (
    <ParentComponent
    {...(!showElement && { onPress })}
    className="flex-col items-start justify-between px-5 py-3 border-t bg-primary-light dark:bg-primary-dark border-border-color dark:border-border-color/20"
    >
    <View className="flex-1">
      <Text className="text-lg font-semibold text-primary-title-color dark:text-primary-light">
      	<Text>{getCityName(load?.originCity)}</Text>
        <Text> - {getCityName(load.destinationCity)}</Text>
      </Text>
    </View>

    <View className="flex-row items-center justify-between flex-1 w-full mt-2">
    <View className="flex-row items-center">
        <Text className="text-sm text-gray-600">{t ('truck-type.' + load.cargoType)}</Text>
        <Text className="ml-2 text-sm font-bold text-blue-600">{t (load.isWebAd ? 'site' : 'telegram')}</Text>
      </View>

      <View className="items-end">
      <Text className="text-sm text-gray-600">{dateFromNow(load.createdAt || '')}</Text>
    </View>
    </View>
  </ParentComponent>
  );
};

export default LatestLoadCard;
