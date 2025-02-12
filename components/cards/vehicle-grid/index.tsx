import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dateFromNow, formatPrice, getCityName, removePhoneNumbers } from '@/utils/general';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Colors } from '@/utils/colors';
import { CustomOpenLink, CustomPhoneCall, CustomShowMoreText } from '@/components/custom';
import { vehicleCardInterfaceProps } from '@/interface/components';
import { ButtonBookmark } from '@/components/buttons';
import { getCityByIds } from '@/redux/reducers/city';
import CityModel from '@/models/city';

const VehicleCard = ({vehicle, onPress, showElement = false, close, isUpdate  = false}: vehicleCardInterfaceProps) => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const { user } = useAppSelector(state => state.auth);
  const { phoneLoading } = useAppSelector(state => state.variable);
  const { vehicleCities } = useAppSelector(state => state.city);
    
  React.useEffect(() => {
    if (isUpdate) {
      vehicle.openMessageCounter++;
      vehicle.save(dispatch);
    }
  }, [isUpdate]);

    const destinationCityIds = React.useMemo(() => vehicle.destinationCityIds.length ? vehicle.destinationCityIds.join(',') : '', [vehicle.destinationCityIds]);

    // React.useEffect(() => {
    //   dispatch(getCityByIds({ids: destinationCityIds, vehicleId: String(vehicle.id)}));
    // }, []);
  
  const cities: any = React.useMemo(() => {
    if (vehicle.id && !vehicleCities[vehicle.id]) {
      dispatch(getCityByIds({ids: destinationCityIds, vehicleId: String(vehicle.id)}));
      return ''
    }
    return vehicleCities[vehicle.id || 1];
  }, [vehicle.id, vehicleCities])

  function handleDetermineTon(weight: number) {
    if (weight < 0.5) {
      return t('post.weight-kg', { weight: weight * 1000 });
    } else {
      return t('post.weight', { weight });
    }
  }
  
  React.useEffect(() => {}, [vehicle.telegram, vehicle.phone, vehicle.loading]);
  
  if (!user) {
    return null;
  }
  
  const ParentComponent = showElement ? View : TouchableOpacity; 
  
  return (
    <ParentComponent
      {...(!showElement && { onPress })} 
      className={`mb-4 bg-white ${showElement ? 'overflow-visible' : 'p-4 shadow-md rounded-xl'}`}>
      {/* Top Row */}
      {!showElement && <View className="flex-row items-center justify-between mb-4">
        {/* Cargo Type and Weight */}
        <View className="flex-row items-center space-x-2">
          <Text className="font-bold text-gray-700 underline">{t ('truck-type.' + vehicle.truckType)}</Text>
          <Ionicons name="car" size={16} color="#6b7280" />
          <View className="px-3 py-1 rounded-full bg-primary">
            <Text className="text-sm text-white">{handleDetermineTon(vehicle.weight)}</Text>
          </View>
        </View>

        {/* Telegram and Bookmark Buttons */}
        <View className="flex-row items-center space-x-3">
          <View className="px-3 py-1 rounded-full bg-primary">
            <Text className="text-sm text-white">{t (vehicle.isWebAd ? 'site' : 'telegram')}</Text>
          </View>
          <ButtonBookmark model={vehicle} paramName='bookmarkedVehicleIds'/>
        </View>
      </View>}

      {/* Origin and Destination */}
      <View className="flex-col items-start my-4">
        {/* Origin */}
        <View className="flex-row items-center flex-1 w-full space-x-2">
          <Text className="text-lg font-bold">{getCityName(vehicle?.originCity)}</Text>
          <View className='flex-row items-center space-x-1'>
            <Text className="text-gray-500">
            {vehicle.originCountry?.icon}
            </Text>
            <Text className="text-gray-500">
              {getCityName(vehicle.originCountry)}
            </Text>
          </View>
        </View>

        {/* Path Line */}
        {/* <View className="h-[2px] bg-gradient-to-r from-blue-400 to-transparent flex-1 mx-4" /> */}

        {/* Destination */}
        <View className="items-end flex-1">
          {cities && cities.map((city: CityModel, key: any) => <Text key={key} className="text-md">{getCityName(city)}{(key + 1) !== cities.length && ","}</Text>)}          
        </View>
      </View>

      {
        showElement && <>
         <View className="my-2 border-t border-gray-300"></View>

          {/* Details */}
          <View className="space-y-2">
            {!vehicle.phone && <TouchableOpacity disabled={phoneLoading} onPress={() => vehicle.phoneFunction(user, dispatch, close)} className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                {phoneLoading ? <ActivityIndicator size={18} color={Colors.light.tint} /> : <Ionicons name="call" size={18} color={Colors.light.tint} /> }
              </View>
              <Text className="text-base">
                {t ('show-phone-number')}
              </Text>
            </TouchableOpacity>}

            {vehicle.phone && <View><CustomPhoneCall phoneNumber={vehicle.phone} loading={phoneLoading} /></View>}
            
            {vehicle.telegram && <View><CustomOpenLink url={vehicle.telegram} /> </View>}
            
            {(vehicle.telegram || vehicle.phone) && vehicle.url ? <View><CustomOpenLink url={vehicle.url} text='message-link' /></View> : ''}

            {vehicle.weight && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="scale" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-base">{handleDetermineTon(vehicle.weight)}</Text>
            </View>}

            {vehicle.isDagruz && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="cube" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-base">{t ('dagruz')}</Text>
            </View>}
   
            {vehicle.isLikelyDispatcher && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="person" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-base">{t ('is-likely-dispatcher')}</Text>
            </View>}
            
            <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="time" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-base">{dateFromNow(vehicle?.publishedDate || vehicle?.createdAt || '')}</Text>
            </View>
          </View>

          {/* Separator */}
          <View className="my-2 border-t border-gray-300"></View>

          
          <CustomShowMoreText 
            text={vehicle.phone ? vehicle.description : removePhoneNumbers(vehicle.description).text}
          />
          
        </>
      }
      {/* Bottom Row */}
      {!showElement && <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
        {/* Created At */}
        <View className="flex-row items-center space-x-2">
          <Ionicons name="calendar" size={16} color="#9ca3af" />
          <Text className="text-sm text-gray-500">{dateFromNow(vehicle.publishedDate || vehicle.createdAt || '')}</Text>
        </View>

      </View>}
    </ParentComponent>
  );
};

export default VehicleCard;
