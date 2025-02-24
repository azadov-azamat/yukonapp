import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dateFromNow, formatPrice, getCityCountryName } from '@/utils/general';
import LoadModel from '@/models/load';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { AdCardInterfaceProps } from '@/interface/components';

const AdCard = ({record, onPress, showElement = false}: AdCardInterfaceProps) => {
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
      <Text className="text-lg font-bold">{getCityCountryName(record, 'origin')}</Text>
        <Text className="text-lg font-bold"> - {getCityCountryName(record, 'destination')}</Text>
      </Text>
    </View>

    <View className="flex-row items-center justify-between flex-1 w-full mt-1">
    <View className="flex-row items-center">
        <Text className="text-sm text-gray-600">{t ('truck-type.' + (record instanceof LoadModel ? record.cargoType : record.truckType))}</Text>
        <TouchableOpacity className="ml-2">
          <Text className="font-bold text-blue-600">{t (record.isWebAd ? 'site' : 'telegram')}</Text>
        </TouchableOpacity>
      </View>

      <View className="items-end">
      <Text className="text-sm text-gray-600">{dateFromNow(record.publishedDate || record.createdAt || '')}</Text>
    </View>
    </View>
  </ParentComponent>
  );
};

export default AdCard;
