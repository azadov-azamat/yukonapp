import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dateFromNow, formatPrice, getCityName } from '@/utils/general';
import LoadModel from '@/models/load';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { Colors } from '@/utils/colors';

interface loadInterface {
  load: LoadModel,
  onPress?: () => void;
  showElement?: boolean;
}
const LoadCard = ({load, onPress, showElement = false}: loadInterface) => {
  const {user} = useAppSelector(state => state.auth);
  const {t} = useTranslation();
  
  function handleDetermineTon(weight: number) {
    if (weight < 0.5) {
      return t('post.weight-kg', { weight: weight * 1000 });
    } else {
      return t('post.weight', { weight });
    }
  }
  
  function isMarkedExpired() {
    return !!user?.markedExpiredLoads.find((item) => item === load.id);
  }
  console.log(load);
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-4 bg-white ${showElement ? '' : 'p-4 shadow-md rounded-xl'}`}>
      {/* Top Row */}
      {!showElement && <View className="flex-row items-center justify-between mb-4">
        {/* Cargo Type and Weight */}
        <View className="flex-row items-center space-x-2">
          <Text className="font-bold text-gray-700 underline">{t ('truck-type.' + load.cargoType)}</Text>
          <Ionicons name="car" size={16} color="#6b7280" />
          <View className="px-3 py-1 rounded-full bg-primary">
            <Text className="text-sm text-white">{handleDetermineTon(load.weight)}</Text>
          </View>
        </View>

        {/* Telegram and Bookmark Buttons */}
        <View className="flex-row items-center space-x-3">
          <View className="px-3 py-1 rounded-full bg-primary">
            <Text className="text-sm text-white">{t (load.isWebAd ? 'site' : 'telegram')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => null}
            className="items-center justify-center w-6 h-6 bg-gray-200 rounded-full"
          >
            <Ionicons name="bookmark-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>}

      {/* Origin and Destination */}
      <View className="flex-row items-center justify-between my-4">
        {/* Origin */}
        <View className="items-start flex-1">
          <Text className="text-lg font-bold">{getCityName(load?.originCity)}</Text>
          <Text className="text-gray-500">{load?.originCountry?.icon + getCityName(load?.originCountry)}</Text>
        </View>

        {/* Path Line */}
        <View className="h-[2px] bg-gradient-to-r from-blue-400 to-transparent flex-1 mx-4" />

        {/* Destination */}
        <View className="items-end flex-1">
          <Text className="text-lg font-bold">{getCityName(load.destinationCity)}</Text>
          <Text className="text-gray-500">{load.destinationCountry?.icon + getCityName(load.destinationCountry)}</Text>
        </View>
      </View>

      {
        showElement && <>
         <View className="my-2 border-t border-gray-300"></View>

          {/* Details */}
          <View className="space-y-2">
            <TouchableOpacity className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="call" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-lg blue-500">
                telefon raqamini ko'rsatish
              </Text>
            </TouchableOpacity>

            <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="cube" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-lg">Laminant</Text>
            </View>

            <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="scale" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-lg">35t</Text>
            </View>

            <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="cash" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-lg font-semibold text-blue-500">$5 400</Text>
            </View>

            <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="time" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-lg">6 soat oldin</Text>
            </View>
          </View>

          {/* Separator */}
          <View className="my-2 border-t border-gray-300"></View>

          {/* Description */}
          <Text className="text-sm text-gray-600">
            ❗ Toshkentdan ❗ ❗ ❗ Buxoroga ❗ 📦 Laminant 35 tonna Fraxt 💵 5. 400
            Logist ❌❌
          </Text>

        </>
      }
      {/* Bottom Row */}
      {!showElement && <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
        {/* Created At */}
        <View className="flex-row items-center space-x-2">
          <Ionicons name="calendar" size={16} color="#9ca3af" />
          <Text className="text-sm text-gray-500">{dateFromNow(load.publishedDate || load.createdAt || '')}</Text>
        </View>

        {/* Price */}
        <View className="flex-row items-center space-x-2">
          <Text className="text-lg font-bold text-primary">{formatPrice(load.price)}</Text>
          <Ionicons name="cash-outline" size={20} color="#2563eb" />
        </View>
      </View>}
    </TouchableOpacity>
  );
};

export default LoadCard;
