import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { ButtonBookmark } from '@/components/buttons';
import { dateFromNow, formatPrice, getCityName, removePhoneNumbers } from '@/utils/general';
import LoadModel from '@/models/load';
import { TFunction } from 'i18next';
import { CustomOpenLink, CustomPhoneCall } from '@/components/custom';
import dayjs from 'dayjs';
import { ConfirmModal } from '@/components/modal';
import Toast from 'react-native-toast-message';

interface LoadViewItemProps {
  recordId: number | null;
}

export interface LoadViewBottomSheetRef {
  open: () => void;
  close: () => void;
}

const LoadViewBottomSheet = React.forwardRef<LoadViewBottomSheetRef, LoadViewItemProps>(({ recordId }, ref) => {
  const { isDarkMode, theme } = useTheme();
  // const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['90%'], []);
  
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
      <BottomSheetView className="relative flex-1">
        {/* {loadingLoadById && <View className="items-center justify-center h-full px-4 ">
          <ActivityIndicator size={24} color={theme.colors.primary} />
        </View>} */}
        <View className="h-full px-4 ">
          <LoadHeader t={t} bottomSheetRef={bottomSheetRef} />

          <LoadStatus t={t} />
          
          <View className='w-full mt-1 border-b border-border-color'/>
                
          {/* Load Details */}
          <LoadDetails t={t} />
          
          {/* Phone Call Button */}
          <LoadFooter t={t} />
          
          {/* <LoadGridCard load={load} showElement isUpdate/> */}
          </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const LoadStatus: React.FC<{t: TFunction}> = React.memo(({ t }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList<any>>(null);
  const { load } = useAppSelector(state => state.load);
  console.log("load-status rendering...");
  
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
    if (!load) return [];
    
    return [
      { name: 'isDagruz', label: t('dagruz') },
      { name: 'cargoType', label: formatTruckTypes(load.cargoType, load.cargoType2) },
      { name: 'hasPrepayment', label: t('has-prepayment') },
      { name: 'paymentType', label: t('payment-type.' + load.paymentType) },
      { name: 'isWebAd', label: t('is-web-ad') },
      { name: 'isLikelyOwner', label: t('likely-owner') },
      { name: 'weight', label: handleDetermineTon(load.weight) },
    ];
  }, [load, t]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      // Aylantirish uchun indexni yangilash
      setCurrentIndex(prevIndex => (prevIndex + 1) % booleanAttributes.length);
    }, 3000); // Har 3 soniyada aylantirish

    return () => clearInterval(interval); // Komponent o'chirilganda intervalni to'xtatish
  }, [booleanAttributes]);
  
  if (!load) return null;
  
  return (
      <View>
          <FlatList
            data={booleanAttributes.filter(attr => load[attr.name as keyof LoadModel] && load[attr.name as keyof LoadModel] !== 'not_specified')}
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

const LoadHeader: React.FC<{t: TFunction, bottomSheetRef: React.RefObject<BottomSheet>}> = React.memo(({ t, bottomSheetRef }) => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(prev => !prev);
  const { user } = useAppSelector(state => state.auth);
  const { load } = useAppSelector(state => state.load);
  
  const handleDeleteLoad = (resultModal: 'confirm' | 'deny') => {
    if (resultModal === 'confirm' && user && load) {
      let markedExpiredLoads = user.markedExpiredLoads || [];
      markedExpiredLoads.push(load.id || '1'); 
      user.markedExpiredLoads = markedExpiredLoads;
      user.save(dispatch);
      bottomSheetRef.current?.close();
      Toast.show({
        text1: t('cargo-out-dated'),
        type: 'success',
      })
    }
    setOpen(false);
  }

  if (!load) return null;
  return (  
   <>
       <View className="relative flex-row items-center justify-center py-4 pb-5 border-b border-border-color">
            {/* <Text className='z-0 text-lg font-bold'>{load.goods}</Text> */}
            <View className="absolute left-0 flex-row space-x-1">
              <View className='z-10 flex-row items-center px-2 py-0.5 space-x-1 border rounded-2xl bg-primary/20 border-border-color/20'>
                  <Ionicons name='eye-outline' size={18} color={theme.colors.primary}/>
                  <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{load.openMessageCounter}</Text>
              </View>
              <View className='flex-row items-center px-2 py-0.5 space-x-1 border rounded-2xl bg-primary/20 border-border-color/20'>
                  <Ionicons name='call-outline' size={18} color={theme.colors.primary}/>
                  <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{load.phoneViewCounter}</Text>
              </View>
            </View>

            <TouchableOpacity className="absolute right-0" onPress={toggle}>
              <Ionicons name='trash-outline' size={20} color={theme.colors.red}/>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center justify-between my-4">
            {/* Origin */}
            <View className="items-start">
              <Text className="text-lg font-bold text-primary-title-color dark:text-primary-light">{getCityName(load?.originCity)}</Text>
              {load.originCountry && <Text className="text-primary-dark/50 dark:text-primary-light/50">{load.originCountry?.icon + " " + getCityName(load.originCountry)}</Text>}
            </View>

            {/* Path Line */}
            <View className='relative items-center flex-auto max-w-40'>
              <View className="absolute left-0 right-0 h-1 top-3.5 bg-[repeating-linear-gradient(90deg,#6b46c1,#6b46c1_5px,transparent_5px,transparent_10px)]"></View>
              <View className='relative z-10 items-center justify-center inline-block w-8 h-8 p-1 border rounded-full bg-primary-light dark:bg-primary/50 border-border-color'>
                <Ionicons name='chevron-forward' size={20} color={theme.colors.icon}/>
              </View>
              {load.distanceInKm && <View className='absolute justify-center items-center left-0 right-0 -translate-x-1/2 -translate-y-1/2 bottom-[-20px]'>
                <Text className='text-primary-dark/50 dark:text-primary-light/50'>{load.distanceInKm} km</Text>
              </View>}
            </View>
            
            {/* Destination */}
            <View className="items-end">
              <Text className="text-lg font-bold text-primary-title-color dark:text-primary-light">{getCityName(load.destinationCity)}</Text>
              {load.destinationCountry && <Text className="text-primary-dark/50 dark:text-primary-light/50">{load.destinationCountry?.icon + " " + getCityName(load.destinationCountry)}</Text>}
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

const LoadDetails: React.FC<{t: TFunction}> = React.memo(({ t }) => {  
  const { theme } = useTheme();
  const { load } = useAppSelector(state => state.load);

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
  
  if (!load) return null;
  
  return (
    <View className='my-4 space-y-2'>
      {load.goods && <View className='flex-row items-center space-x-2'>
        <View className='p-2 border rounded-full bg-primary/20 border-border-color/20'>
          <Ionicons name='cube-outline' size={20} color={theme.colors.primary}/>
        </View>
        <View className='space-y-1'>
          <Text className='text-sm text-primary-dark dark:text-primary-light'>{t('loads.goods')}</Text>
          <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{load.goods}</Text>
        </View>
      </View>}
    {(load.price || load.hasPrepayment || load.prepaymentAmount) && <View className='flex-row items-center space-x-2'>
        <View className='p-2 border rounded-full bg-primary/20 border-border-color/20'>
          <Ionicons name='server-outline' size={20} color={theme.colors.primary}/>
        </View>
        <View className='space-y-1'>
          <Text className='text-sm text-primary-dark dark:text-primary-light'>{t('loads.price')}</Text>
          <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{formatPriceAndPrepayment(
          load.price, 
          load.hasPrepayment, 
          load.prepaymentAmount, 
          load.originCountry?.id || 1,
          load.destinationCountry?.id || 1
        )}</Text>
        </View>
      </View>}
    
    {load.paymentType && (load.paymentType !== 'not_specified') && <View className='flex-row items-center space-x-2'>
        <View className='p-2 border rounded-full bg-primary/20 border-border-color/20'>
          <Ionicons name='card-outline' size={20} color={theme.colors.primary}/>
        </View>
        <View className='space-y-1'>
          <Text className='text-sm text-primary-dark dark:text-primary-light'>{t('loads.payment-type')}</Text>
          <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{formatPaymentType(load.paymentType)}</Text>
        </View>
      </View>
    }
    
    {load.loadReadyDate && <View className='flex-row items-center space-x-2'>
        <View className='p-2 border rounded-full bg-primary/20 border-border-color/20'>
          <Ionicons name='calendar-outline' size={20} color={theme.colors.primary}/>
        </View>
        <View className='space-y-1'>
          <Text className='text-sm text-primary-dark dark:text-primary-light'>{t('loads.load-ready-date')}</Text>
          <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{formatLoadReadyDate(load.loadReadyDate)}</Text>
        </View>
      </View>
    }
    
    {load.customsClearanceLocation && (load.customsClearanceLocation !== null) && <View className='flex-row items-center space-x-2'>
        <View className='p-2 border rounded-full bg-primary/20 border-border-color/20'>
          <Ionicons name='person-outline' size={20} color={theme.colors.primary}/>
        </View>
        <View className='space-y-1'>
          <Text className='text-sm text-primary-dark dark:text-primary-light'>{t('loads.customs-clearance')}</Text>
          <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{t ('customs-clearance', {customClearance: load.customsClearanceLocation})}</Text>
        </View>
      </View>
    }

    {load.createdAt && <View className='flex-row items-center space-x-2'>
        <View className='p-2 border rounded-full bg-primary/20 border-border-color/20'>
          <Ionicons name='time-outline' size={20} color={theme.colors.primary}/>
        </View>
        <View className='space-y-1'>
          <Text className='text-sm text-primary-dark dark:text-primary-light'>{t('loads.created-at')}</Text>
          <Text className='text-sm font-bold text-primary-dark dark:text-primary-light'>{dateFromNow(load.createdAt)}</Text>
        </View>
      </View>
    }
      
      {/*  Model Description */}
      <View className='pt-4 mt-2 border-t border-border-color'>
        <Text className='mb-2 text-lg font-bold text-primary-dark dark:text-border-color'>{t('table.description')}</Text>
        <Text className='text-sm leading-tight text-primary-dark dark:text-border-color'>{load.phone ? load.description : removePhoneNumbers(load.description).text}</Text>
      </View>
  </View>
  )
});

const LoadFooter: React.FC<{t: TFunction}> = React.memo(({ t }) => {  
  const dispatch = useAppDispatch();
  const { phoneLoading, urlLoading } = useAppSelector(state => state.variable);
  const { user } = useAppSelector(state => state.auth);
  const { load } = useAppSelector(state => state.load);
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const toggleDropdown = () => setDropdownVisible(prev => !prev);
  const { theme } = useTheme();
  
  React.useEffect(() => {
    if (load?.phone) {
      toggleDropdown();
    }
  }, [load?.phone]);

  // React.useEffect(() => {
  //   if (load?.description) {
  //     load.viewCount += 1;
  //     load.save(dispatch);
  //   }
  // }, [load?.description]);
  
  if (!load) return null;
  return (
    <View className='absolute left-0 right-0 flex-row items-center justify-between px-2 pt-4 pb-10 my-4 space-x-2 border-t shadow-sm -bottom-10 border-border-color/20 bg-primary-light dark:bg-primary-dark'>
          
    <ButtonBookmark model={load} paramName='bookmarkedLoadIds' size={20} style='w-10 h-10 border border-border-color/20 bg-transparent'/>

    <View className='flex-row items-center flex-1 space-x-2'>
    {!load.phone && user && <TouchableOpacity
                              disabled={phoneLoading} 
                              onPress={() => load.phoneFunction(user, dispatch)} 
                              className='px-4 py-2.5 w-full rounded-3xl items-center bg-primary'
                            >
        <Text className="text-base font-medium dark:text-primary-dark text-primary-light">
          {!phoneLoading ? t ('show-phone-number') : t ('loading-options')}
        </Text>
      </TouchableOpacity>}

      {load.phone && (
        <View className='w-full px-4 py-2.5 rounded-3xl overflow-auto items-center bg-primary'>
          <TouchableOpacity onPress={toggleDropdown}>
            <Text className="text-base font-medium dark:text-primary-dark text-primary-light">
              {t('show-phone-number')}
            </Text>
          </TouchableOpacity>
          
          {dropdownVisible && (
            <View className='absolute right-0 p-2 px-4 mt-2 space-y-2 bg-white border rounded-lg shadow-xl bottom-12 border-border-color'>
                      {load.phone && (
                        <View>
                          <CustomPhoneCall phoneNumber={load.phone} loading={phoneLoading} />
                        </View>
                      )}  
                      {load.telegram && (
                        <View>
                          <CustomOpenLink url={load.telegram} />
                        </View>
                      )}
                      {!load.url && user && (
                        <View>
                            <TouchableOpacity onPress={() => load.urlFunction(user, dispatch)} className='flex-row items-center space-x-2'>
                              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                              {urlLoading ? <ActivityIndicator size={18} color={theme.colors.primary} /> : <Ionicons name="link-outline" size={18} color={theme.colors.primary} /> }
                              </View>
                              <Text className='text-base text-blue-500'>{t('message-link')}</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                      {load.url && (
                        <View>
                          <CustomOpenLink url={load.url} text='message-link' />
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

export default React.memo(LoadViewBottomSheet);
