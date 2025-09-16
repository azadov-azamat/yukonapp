import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dateFromNow, formatPrice, getCityName, removePhoneNumbers } from '@/utils/general';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
  // import { Colors } from '@/utils/colors';
import { CustomOpenLink, CustomPhoneCall, CustomShowMoreText } from '@/components/custom';
import dayjs from "dayjs";
import { loadCardInterfaceProps } from '@/interface/components';
import { ButtonBookmark } from '@/components/buttons';
import { useTheme } from '@/config/ThemeContext';

const LoadCard = ({load, onPress, showElement = false, close, isUpdate  = false}: loadCardInterfaceProps) => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const { user } = useAppSelector(state => state.auth);
  const { phoneLoading } = useAppSelector(state => state.variable);
  const {theme} = useTheme();

  React.useEffect(() => {
    if (isUpdate) {
        load.openMessageCounter++;
        load.save(dispatch);
    }
  }, [isUpdate]);

  function handleDetermineTon(weight: number) {
    if (weight < 0.5) {
      return t('post.weight-kg', { weight: weight * 1000 });
    } else {
      return t('post.weight', { weight });
    }
  }

  function formatPaymentType(type: string) {
    return t ('post.payment-type', {
      type: t ('payment-type.' + type),
    });
  }

  React.useEffect(() => {

  }, [load.telegram, load.phone, load.loading]);

  if (!user) {
    return null;
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
    return `${(price ? formatPrice(price, "", "", originId === 1 && destinationId === 1) : '') + prepayment}`;
  }

  const ParentComponent = showElement ? View : TouchableOpacity;

  return (
    <ParentComponent
      {...(!showElement && { onPress })}
      className={`mb-4 bg-primary-light dark:bg-primary-dark ${showElement ? 'overflow-visible' : 'px-4 py-2 shadow-md rounded-xl'}`}>
      {/* Top Row */}
      {!showElement && <View className="flex-row items-center justify-between">
        {/* Cargo Type and Weight */}
        <View className="flex-row items-center space-x-2">
          <Text className="font-bold underline text-primary-dark dark:text-border-color/40">{t ('truck-type.' + load.cargoType)}</Text>
          <Ionicons name="car" size={16} color={theme.colors.icon} />
          {/* <View className="px-3 py-1 rounded-full bg-primary">
            <Text className="text-sm text-white">{handleDetermineTon(load.weight)}</Text>
          </View> */}
        </View>

        {/* Telegram and Bookmark Buttons */}
        <View className="flex-row items-center space-x-3">
          {/* <View className="px-3 py-1 rounded-full bg-primary">
            <Text className="text-sm text-white">{t (load.isWebAd ? 'site' : 'telegram')}</Text>
          </View> */}
          <ButtonBookmark model={load} paramName='bookmarkedLoadIds'/>
        </View>

      </View>}

      {/* Origin and Destination */}
      <View className="flex-row items-center justify-between my-2">
        {/* Origin */}
        <View className="items-start flex-1">
          <Text className="text-lg font-bold text-primary-title-color dark:text-primary-light">{getCityName(load?.originCity)}</Text>
          <Text className="text-primary-dark/50 dark:text-primary-light/50">{load.originCountry?.icon + " " + getCityName(load.originCountry)}</Text>
        </View>

        {/* Path Line */}
        <View className='relative items-center flex-auto max-w-40'>
              
              <View className='relative z-10 items-center justify-center inline-block w-8 h-8 pl-0.5 border rounded-full bg-primary-light dark:bg-primary/50 border-border-color'>
                <Ionicons name='chevron-forward' size={20} color={theme.colors.icon}/>
              </View>
              {load.distanceInKm && <View className='absolute justify-center items-center left-0 right-0 -translate-x-1/2 -translate-y-1/2 bottom-[-20px]'>
                <Text className='text-primary-dark/50 dark:text-primary-light/50'>{load.distanceInKm} km</Text>
              </View>}
        </View>

        {/* Destination */}
        <View className="items-end flex-1">
          <Text className="text-lg font-bold text-primary-title-color dark:text-primary-light">{getCityName(load.destinationCity)}</Text>
          <Text className="text-primary-dark/50 dark:text-primary-light/50">{load.destinationCountry?.icon + " " + getCityName(load.destinationCountry)}</Text>
        </View>
      </View>

      {
        showElement && <>
         <View className="my-2 border-t border-border-color dark:border-border-color"></View>

          {/* Details */}
          <View className="space-y-2">
            {!load.phone && <TouchableOpacity disabled={phoneLoading} onPress={() => load.phoneFunction(user, dispatch, close)} className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                {phoneLoading ? <ActivityIndicator size={18} color={theme.colors.primary} /> :
                <Ionicons name="call" size={18} color={theme.colors.primary} /> }
              </View>
              <Text className="text-base text-primary-dark dark:text-border-color">
                {t ('show-phone-number')}
              </Text>
            </TouchableOpacity>}

            {load.phone && <View><CustomPhoneCall phoneNumber={load.phone} loading={phoneLoading} /></View>}

            {load.telegram && <View><CustomOpenLink url={load.telegram} /> </View>}

            {(load.telegram || load.phone) && load.url ? <View><CustomOpenLink url={load.url} text='message-link' /></View> : ''}

            {load.goods && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="cube" size={18} color={theme.colors.primary} />
              </View>
              <Text className="text-base text-primary-dark dark:text-border-color">{load.goods}</Text>
            </View>}

            {load.weight && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="scale" size={18} color={theme.colors.primary} />
              </View>
              <Text className="text-base text-primary-dark dark:text-border-color">{handleDetermineTon(load.weight)}</Text>
            </View>}

            {(load.price || load.hasPrepayment || load.prepaymentAmount) && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="cash" size={18} color={theme.colors.primary} />
              </View>
              <Text className="text-base font-semibold text-blue-500">{showElement ?
                formatPriceAndPrepayment(
                  load.price,
                  load.hasPrepayment,
                  load.prepaymentAmount,
                  load.originCountry?.id || 1,
                  load.destinationCountry?.id || 1
                ) : formatPrice(load.price)
                }</Text>
            </View>}

            {load.isDagruz && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="cube" size={18} color={theme.colors.primary} />
              </View>
              <Text className="text-base text-primary-dark dark:text-border-color">{t ('dagruz')}</Text>
            </View>}

            {load.paymentType && (load.paymentType !== 'not_specified') && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="card" size={18} color={theme.colors.primary} />
              </View>
              <Text className="text-base text-primary-dark dark:text-border-color">{formatPaymentType(load.paymentType)}</Text>
            </View>}

            {load.loadReadyDate && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="calendar" size={18} color={theme.colors.primary} />
              </View>
              <Text className="text-base text-primary-dark dark:text-border-color">{t ('loads.load-ready-date')} - {formatLoadReadyDate(load.loadReadyDate)}</Text>
            </View>}

            {load.isLikelyOwner && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="person" size={18} color={theme.colors.primary} />
              </View>
              <Text className="text-base text-primary-dark dark:text-border-color">{t ('is-likely-owner')}</Text>
            </View>}

            { load.customsClearanceLocation && (load.customsClearanceLocation !== null) && <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="person" size={18} color={theme.colors.primary} />
              </View>
              <Text className="text-base text-primary-dark dark:text-border-color">{t ('customs-clearance', {customClearance: load.customsClearanceLocation})}</Text>
            </View>}

            <View className='flex-row items-center space-x-2'>
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="time" size={18} color={theme.colors.primary} />
              </View>
              <Text className="text-base text-primary-dark dark:text-border-color">{dateFromNow(load?.createdAt || '')}</Text>
            </View>
          </View>

          {/* Separator */}
          <View className="my-2 border-t border-gray-300"></View>


          <View className=''>
            <Text className='text-sm text-primary-dark dark:text-border-color'>{load.phone ? load.description : removePhoneNumbers(load.description).text}</Text>
          </View>
        </>
      }

      {/* Bottom Row */}
      {!showElement && <View className="flex-row items-center justify-between pt-2 border-t border-gray-200">
        {/* Created At */}
        <View className="flex-row items-center space-x-2">
          <Ionicons name="calendar" size={16} color={theme.colors.icon} />
          <Text className="text-sm text-primary-dark dark:text-border-color">{dateFromNow(load.createdAt || '')}</Text>
        </View>

        {/* Price */}
        <View className="flex-row items-center space-x-2">
          <Text className="text-lg font-bold text-primary">{formatPrice(load.price)}</Text>
          <Ionicons name="cash-outline" size={20} color={theme.colors.primary} />
        </View>
      </View>}
    </ParentComponent>
  );
};

export default LoadCard;
