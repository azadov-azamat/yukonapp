import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { ButtonBookmark } from '@/components/buttons';
import { dateFromNow, formatPrice, getCityCountryName, getCityName, removePhoneNumbers } from '@/utils/general';
import LoadModel from '@/models/load';
import { TFunction } from 'i18next';
import { CustomOpenLink, CustomPhoneCall } from '@/components/custom';
import dayjs from 'dayjs';
import { ConfirmModal } from '@/components/modal';
import Toast from 'react-native-toast-message';
import VehicleModel from '@/models/vehicle';
import CityModel from '@/models/city';

export interface VehicleViewBottomSheetRef {
  open: () => void;
  close: () => void;
}

const VehicleViewBottomSheet = React.forwardRef<VehicleViewBottomSheetRef>((_, ref) => {
  const { isDarkMode, theme } = useTheme();
  
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['80%'], []);
  const { vehicle } = useAppSelector(state => state.vehicle);
  const { vehicleCities } = useAppSelector(state => state.city);
  
  React.useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));
  
  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

      // Remove the console.log that might trigger re-renders
  const cities = React.useMemo(() =>
    vehicleCities[vehicle && vehicle.id || 1],
    [vehicle && vehicle.id, vehicleCities]
  );
      
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: isDarkMode ? theme.colors.dark : theme.colors.light,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? '#9CA3AF' : '#6B7280',
      }}
    >
      <BottomSheetView className="relative flex-1" style={{
        height: '100%',
      }}>
        {/* {loadingLoadById && <View className="items-center justify-center h-full px-4 ">
          <ActivityIndicator size={24} color={theme.colors.primary} />
        </View>} */}
        <View className="h-full px-4 ">
          <VehicleHeader bottomSheetRef={bottomSheetRef} cities={cities}/>

          <VehicleStatus />
          
          <View className='w-full mt-1 border-b border-border-color'/>
                
          {/* Load Details */}
          <VehicleDetails />
          
          {/* Phone Call Button */}
          <VehicleFooter />
          
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const VehicleHeader: React.FC<{bottomSheetRef: React.RefObject<BottomSheet | null>, cities: any}> = React.memo(({ bottomSheetRef, cities }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(prev => !prev);
  const { user } = useAppSelector(state => state.auth);
  const { vehicle } = useAppSelector(state => state.vehicle);
  
  const handleDeleteLoad = (resultModal: 'confirm' | 'deny') => {
    if (resultModal === 'confirm' && user && vehicle) {
      let markedExpiredLoads = user.markedExpiredLoads || [];
      markedExpiredLoads.push(vehicle.id || '1'); 
      user.markedExpiredLoads = markedExpiredLoads;
      user.save(dispatch);
      bottomSheetRef?.current?.close();
      Toast.show({
        text1: t('cargo-out-dated'),
        type: 'success',
      })
    }
    setOpen(false);
  }

  if (!vehicle) return null;
  
  return (  
   <>
       <View className="relative flex-row items-center justify-center py-4 pb-5 border-b border-border-color">
            {/* <Text className='z-0 text-lg font-bold'>{load.goods}</Text> */}
            <View className="absolute left-0 flex-row space-x-1">
              <View className='z-10 flex-row items-center px-2 py-0.5 space-x-1 border rounded-2xl bg-primary/20 border-border-color/20'>
                  <Ionicons name='eye-outline' size={18} color={theme.colors.primary}/>
                  <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{vehicle.openMessageCounter}</Text>
              </View>
              <View className='flex-row items-center px-2 py-0.5 space-x-1 border rounded-2xl bg-primary/20 border-border-color/20'>
                  <Ionicons name='call-outline' size={18} color={theme.colors.primary}/>
                  <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{vehicle.phoneViewCounter}</Text>
              </View>
            </View>

            <TouchableOpacity className="absolute right-0" onPress={toggle}>
              <Ionicons name='trash-outline' size={20} color={theme.colors.red}/>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center justify-between my-4">
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
              <View className="flex-row flex-wrap flex-1">
                {cities?.map((city: CityModel, index: number) => (
                  <Text key={city.id} className="text-md">
                    {getCityName(city)}{index !== (cities.length - 1) ? ', ' : ''}
                  </Text>
                ))}
              </View>
           </View>
          </View>
          <ConfirmModal
            open={open}
            toggle={toggle}
            text={t('is-cargo-out-date')}
            onClick={handleDeleteLoad}
          />
   </>
  )
});

const VehicleStatus: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList<any>>(null);
  const { vehicle } = useAppSelector(state => state.vehicle);
  
  function handleDetermineTon(weight: number) {
    if (weight < 0.5) {
      return t('post.weight-kg', { weight: weight * 1000 });
    } else {
      return t('post.weight', { weight });
    }
  }
  
  function formatTruckTypes(type: string, type2: string) {
    if (type2 && type2 !== 'not_specified' && type !== type2) {
      return t('post.truck-types', {
        type: t('truck-type.' + type),
        type2: t('truck-type.' + type2),
      });
    } else {
      return t('post.truck-type', {
        type: t('truck-type.' + type),
      });
    }
  }

  const booleanAttributes = React.useMemo(() => {
    if (!vehicle) return [];
    
    return [
      { name: 'isDagruz', label: t('dagruz') },
      { name: 'truckType', label: formatTruckTypes(vehicle.truckType, vehicle.truckType2) },
      { name: 'isWebAd', label: t('is-web-ad') },
      { name: 'isLikelyDispatcher', label: t('is-likely-dispatcher') },
      { name: 'weight', label: handleDetermineTon(vehicle.weight) },
    ];
  }, [vehicle, t]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      // Aylantirish uchun indexni yangilash
      setCurrentIndex(prevIndex => (prevIndex + 1) % booleanAttributes.length);
    }, 3000); // Har 3 soniyada aylantirish

    return () => clearInterval(interval); // Komponent o'chirilganda intervalni to'xtatish
  }, [booleanAttributes]);
  
  if (!vehicle) return null;
  
  return (
      <View>
          <FlatList
            data={booleanAttributes.filter(attr => vehicle[attr.name as keyof VehicleModel] && vehicle[attr.name as keyof VehicleModel] !== 'not_specified')}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={{
              flexDirection: 'row',
              gap: 1,
              padding: 8,
              paddingLeft: 0,
              paddingRight: 0,
              alignContent: 'center'
            }}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <View className="px-4 py-2 mr-2 border bg-primary-light dark:bg-primary/50 border-primary rounded-3xl">
                <Text className="font-bold text-primary dark:text-primary-light">{item.label}</Text>
              </View>
            )}
            onLayout={() => {
              flatListRef.current?.scrollToIndex({ index: currentIndex, animated: true });
            }}
          />
      </View>
  );
});

const VehicleDetails: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { vehicle } = useAppSelector(state => state.vehicle);

  function formatPaymentType(type: string) {
    return t ('post.payment-type', {
      type: t ('payment-type.' + type),
    });
  }
  
  function formatLoadReadyDate(loadReadyDate: string | Date): string {
    const date = dayjs(loadReadyDate);
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');
  
    if (date.isSame(today, 'day')) {
      return `${t('today')}, ${date.format('D MMMM')}`; // "Bugun, 23 Yanvar"
    } else if (date.isSame(tomorrow, 'day')) {
      return `${t('tomorrow')}, ${date.format('D MMMM')}`; // "Ertaga, 24 Yanvar"
    } else {
      return date.format('D MMMM'); // "25 Yanvar"
    }
  }
  
  function formatPriceAndPrepayment(
    price: number,
    hasPrepayment: boolean,
    prepaymentAmount: number,
    originId: number,
    destinationId: number,
  ) {
    const prepayment = hasPrepayment
      ? prepaymentAmount
        ? ` (${t ('prepayment')} ${formatPrice(prepaymentAmount)})`
        : ` (${t ('has-prepayment')})`
      : '';
    return `${(price ? formatPrice(price, originId === 1 && destinationId === 1) : '') + prepayment}`;
  }
  
  if (!vehicle) return null;
  
  return (
    <View className='my-4 space-y-2'>

    {vehicle.createdAt && <View className='flex-row items-center space-x-2'>
        <View className='p-2 border rounded-full bg-primary/20 border-border-color/20'>
          <Ionicons name='time-outline' size={20} color={theme.colors.primary}/>
        </View>
        <View className='space-y-1'>
          <Text className='text-sm text-primary-dark dark:text-primary-light'>{t('loads.created-at')}</Text>
          <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{dateFromNow(vehicle.createdAt)}</Text>
        </View>
      </View>
    }
      
      {/*  Model Description */}
      <View className='pt-4 mt-2 border-t border-border-color'>
        <Text className='mb-2 text-lg font-bold text-primary-dark dark:text-border-color'>{t('table.description')}</Text>
        <Text className='text-sm leading-tight text-primary-dark dark:text-border-color'>{vehicle.phone ? vehicle.description : removePhoneNumbers(vehicle.description).text}</Text>
      </View>
  </View>
  )
});

const VehicleFooter: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { phoneLoading, urlLoading } = useAppSelector(state => state.variable);
  const { user } = useAppSelector(state => state.auth);
  const { vehicle } = useAppSelector(state => state.vehicle);
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const toggleDropdown = () => setDropdownVisible(prev => !prev);
  const { theme } = useTheme();
  
  React.useEffect(() => {
    if (vehicle?.phone) {
      toggleDropdown();
    }
  }, [vehicle?.phone]);

  // React.useEffect(() => {
  //   if (load?.description) {
  //     load.viewCount += 1;
  //     load.save(dispatch);
  //   }
  // }, [load?.description]);
  
  if (!vehicle) return null;
  return (
    <View className='absolute left-0 right-0 flex-row items-center justify-between px-2 pt-4 pb-10 my-4 space-x-2 border-t shadow-sm -bottom-10 border-border-color/20 bg-primary-light dark:bg-primary-dark'>
          
    <ButtonBookmark model={vehicle} paramName='bookmarkedVehicleIds' size={20} style='w-10 h-10 border border-border-color/20 bg-transparent'/>

    <View className='flex-row items-center flex-1 space-x-2'>
    {!vehicle.phone && user && <TouchableOpacity
                              disabled={phoneLoading} 
                              onPress={() => vehicle.phoneFunction(user, dispatch)} 
                              className='px-4 py-2.5 w-full rounded-3xl items-center bg-primary'
                            >
        <Text className="text-base font-medium dark:text-primary-dark text-primary-light">
          {!phoneLoading ? t ('show-phone-number') : t ('loading-options')}
        </Text>
      </TouchableOpacity>}

      {vehicle.phone && (
        <View className='w-full px-4 py-2.5 rounded-3xl overflow-auto items-center bg-primary'>
          <TouchableOpacity onPress={toggleDropdown}>
            <Text className="text-base font-medium dark:text-primary-dark text-primary-light">
              {t('show-phone-number')}
            </Text>
          </TouchableOpacity>
          
          {dropdownVisible && (
            <View className='absolute right-0 p-2 px-4 mt-2 space-y-2 bg-white border rounded-lg shadow-xl bottom-12 border-border-color'>
                      {vehicle.phone && (
                        <View>
                          <CustomPhoneCall phoneNumber={vehicle.phone} loading={phoneLoading} />
                        </View>
                      )}  
                      {vehicle.telegram && (
                        <View>
                          <CustomOpenLink url={vehicle.telegram} />
                        </View>
                      )}
                      {!vehicle.url && user && (
                        <View>
                            <TouchableOpacity onPress={() => vehicle.urlFunction(user, dispatch)} className='flex-row items-center space-x-2'>
                              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                              {urlLoading ? <ActivityIndicator size={18} color={theme.colors.primary} /> : <Ionicons name="link-outline" size={18} color={theme.colors.primary} /> }
                              </View>
                              <Text className='text-base text-blue-500'>{t('message-link')}</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                      {vehicle.url && (
                        <View>
                          <CustomOpenLink url={vehicle.url} text='message-link' />
                        </View>
                      )}
            </View>
          )}
        </View>
      )}
    </View>
  </View>
  )
});

export default React.memo(VehicleViewBottomSheet);
