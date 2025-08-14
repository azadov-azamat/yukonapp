import { Deserializer } from "jsonapi-serializer";
import {AuthDataProps} from "@/interface/redux/auth.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from 'i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import 'dayjs/locale/uz';
import { Linking, Alert, PermissionsAndroid, Platform } from "react-native";
import { setLocation } from "@/redux/reducers/auth";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
import Geolocation from 'react-native-geolocation-service';

export const dateFromNow = (value: string | Date): string => {
  let dayjsLocale = 'uz'; // Default locale
  const currentLanguage = i18n.language;

  switch (currentLanguage) {
    case 'ru':
      dayjsLocale = 'ru';
      break;
    case 'uz':
    case 'uz-Latn':
      dayjsLocale = 'uz-latn'; // If you registered this locale
      break;
    case 'uz-Cyrl':
      dayjsLocale = 'uz'; // uz = Cyrillic
      break;
    case 'en':
    default:
      dayjsLocale = 'en';
      break;
  }

  // Set the locale
  dayjs.locale(dayjsLocale);

  // Convert the value to a dayjs date object
  const date = dayjs(value);

  // Format the date to relative time
  return (
    date
      .fromNow()
      .replace('bir necha ', '')
      .replace('soniya oldin', 'hozir')
  );
};

export function getCityName(city: any): string {
    const currentLanguage = i18n.language;

    const uzKey = city?.name_uz || city?.nameUz;
    const ruKey = city?.name_ru || city?.nameRu;

    const fallbackText = i18n.t('truck-type.not_specified');

    // Return the value based on the current language
    return currentLanguage === 'uz' ? uzKey || fallbackText : ruKey || fallbackText;
}

export function getCityCountryName(model: Record<string, any>, propName: string): string {
  const currentLanguage: string = i18n.language;

  const cityKey = model[`${propName}City`];
  const countryKey = model[`${propName}Country`];

  const uzKey: string | undefined = cityKey?.name_uz || cityKey?.nameUz;
  const ruKey: string | undefined = cityKey?.name_ru || cityKey?.nameRu;
  const enKey: string | undefined = cityKey?.name_en || cityKey?.nameEn;

  const countryUz: string | undefined = countryKey?.name_uz || countryKey?.nameUz;
  const countryRu: string | undefined = countryKey?.name_ru || countryKey?.nameRu;
  const countryEn: string | undefined = countryKey?.name_en || countryKey?.nameEn;

  const fallbackText: string = i18n.t('truck-type.not_specified');

  if (cityKey) {
    if (currentLanguage === 'uz') return uzKey || ruKey || enKey || fallbackText;
    if (currentLanguage === 'ru') return ruKey || uzKey || enKey || fallbackText;
    if (currentLanguage === 'en') return enKey || uzKey || ruKey || fallbackText;
  } else {
    if (currentLanguage === 'uz') return countryUz || countryRu || countryEn || fallbackText;
    if (currentLanguage === 'ru') return countryRu || countryUz || countryEn || fallbackText;
    if (currentLanguage === 'en') return countryEn || countryUz || countryRu || fallbackText;
  }

  return fallbackText;
}

export function getName(object: Record<string, any>, key: string): string {
  const currentLanguage = i18n.language;

  const uzKey = object[key + '_uz'] || object[key + 'Uz'];
  const ruKey = object[key + '_ru'] || object[key + 'Ru'];
  const enKey = object[key + '_en'] || object[key + 'En'];

  const fallbackText = i18n.t('truck-type.not_specified');

  if (currentLanguage === 'uz') return uzKey || ruKey || enKey || fallbackText;
  if (currentLanguage === 'ru') return ruKey || uzKey || enKey || fallbackText;
  if (currentLanguage === 'en') return enKey || uzKey || ruKey || fallbackText;

  // Fallback for other languages
  return uzKey || ruKey || enKey || fallbackText;
}

function getCurrencySymbol(currencyCode: string): string {
  switch ((currencyCode || '').toUpperCase()) {
    case 'UZS':
      return "so'm";
    case 'RUB':
      return '₽';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'KZT':
      return 'tenge';
    default:
      return '$';
  }
}

export const formatPrice = (x: number, currency?: string, pricingUnit?: string, hideSign?: boolean): string => {
    if (!x) return '0';
    const n = Number(x);
    if (!Number.isFinite(n)) return '';
    
    let result = x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const symbol = getCurrencySymbol(currency || '');
    const isEndLetter = currency === 'UZS' || currency === 'KZT';

    if (n <= 50) {
      return result + '%';
    }

  if (x >= 1_000_000) {
      let mlnValue = (x / 1_000_000).toFixed(1); // 1 xonali kasr

      return isEndLetter 
        ? `${mlnValue} ${i18n.t('mln')} ${symbol}`
        : `${symbol}${mlnValue} ${i18n.t('mln')}`;
  }

  // sign/placement
  const sep = isEndLetter ? (hideSign ? '' : ' ') : '';
  const sign = hideSign ? '' : isEndLetter ? '' : symbol;

  if (pricingUnit && pricingUnit !== 'flat') {
    // e.g., "$1 200/ton" vs "1 200 so'm/ton"
    const head = isEndLetter ? `${result}${sep}${symbol} / ` : `${sign}${result} / `;
    return head + i18n.t('pricing-unit.' + pricingUnit);
  }

  return isEndLetter ? `${result}${sep}${symbol}` : `${sign}${result}`;
};

const DefaultDeserializer = new Deserializer({
    keyForAttribute: 'camelCase',
});

export function deserialize(models: unknown) {
    return DefaultDeserializer.deserialize(models);
}

export async function authenticate(data: AuthDataProps, id?: string) {
    await AsyncStorage.setItem('authenticate', JSON.stringify({...data, id}));
}

export function removePhoneNumbers(text: string) {
    const phoneNumberPattern =
      /(?!\d{2}[.-])[+]?(\b\d{1,3}[ .-]?)?([(]?\d{2,3}[)]?)((?:[ .-]?\d){4,7})(?![ .-]?\d)/g;

    const removedPhones: string[] = [];
    const newText = text.replace(phoneNumberPattern, (match) => {
      if (match.trim().endsWith('0000')) {
        return match; // Agar raqam '0000' bilan tugasa, o'zgarmasdan qoldiring
      }
      removedPhones.push(formatPhone(match.trim()));
      return ''; // Telefon raqamni olib tashlang
    });

    return {
      text: newText.trim(), // Tozalangan matnni qaytarish
      removedPhones, // Olib tashlangan telefon raqamlarining ro'yxati
    };
}

export function formatPhone(str: string, prefix = '+998 ') {
    let phone = str;

    if (phone?.startsWith('+998')) {
      phone = str.slice(4);
    }

    let cleaned = ('' + phone).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `${prefix}${match.slice(1).join(' ')}`;
    }

    return phone;
}

export const formatDate = (date: Date) => {
  return date ? new Date(date).toLocaleString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
  }).replace(',', '') : '';
};

export async function openLink(url: string) {
  if (!url) {
    Alert.alert('Error', 'Telegram username is missing!');
    return;
  }

  try {
    // const canOpen = await Linking.canOpenURL(url);
    // if (canOpen) {
      await Linking.openURL(url);
    // } else {
    //   Alert.alert('Error', 'Telegram app not installed!');
    // }
  } catch (error) {
    console.error('Failed to open Telegram:', error);
    Alert.alert('Error, Unable to open Telegram', String(error));
  }
};

export const requestLocationPermission = async (dispatch: any) => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission denied');
      return;
    }
  } 
  // else {
  //   const { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== 'granted') {
  //     console.log('Location permission denied');
  //     return;
  //   }
  // }

  getLocation(dispatch);
};

export const getLocation = (dispatch: any) => {
  Geolocation.getCurrentPosition(
    (position: any) => {
      dispatch(setLocation([position.coords.latitude, position.coords.longitude]));
    },
    (error: any) => {
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};

export function getSubscriptionStatus(endDate: string) {
  const today = new Date()
  const expiration = new Date(endDate)
  const diffTime = expiration.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let status = "active"
  let color = "green"
  let bgColor = "bg-green-100"
  let textColor = "text-green-700"
  let borderColor = "border-green-200"

  if (diffDays <= 0) {
    status = "expired"
    color = "red"
    bgColor = "bg-red-100"
    textColor = "text-red-700"
    borderColor = "border-red-200"
  } else if (diffDays <= 3) {
    status = "critical"
    color = "red"
    bgColor = "bg-red-100"
    textColor = "text-red-700"
    borderColor = "border-red-200"
  } else if (diffDays <= 7) {
    status = "warning"
    color = "orange"
    bgColor = "bg-orange-100"
    textColor = "text-orange-700"
    borderColor = "border-orange-200"
  } else if (diffDays <= 14) {
    status = "caution"
    color = "yellow"
    bgColor = "bg-yellow-100"
    textColor = "text-yellow-700"
    borderColor = "border-yellow-200"
  }

  return { diffDays, status, color, bgColor, textColor, borderColor }
}

export function loadRequestParams(
  {
    page, 
    limit, 
    booleanFilters, 
    origin, 
    destination,
    selectedItems
  }: 
  {
    limit: number, 
    page: number, 
    booleanFilters: any, 
    origin: any, 
    destination: any
    selectedItems: string[]
  }
) {
      let query: Record<string, any> = {
        limit: limit,
        page: page,
        sort: '!createdAt',
        isArchived: false,
        isDeleted: false,
        
      };

      if (booleanFilters['isDagruz']) {
        query.isDagruz = booleanFilters['isDagruz'];
      }

      if (booleanFilters['hasPrepayment']) {
        query.hasPrepayment = booleanFilters['hasPrepayment'];
      }

      if (booleanFilters['isLikelyOwner']) {
        query.isLikelyOwner = booleanFilters['isLikelyOwner'];
      }

      if (booleanFilters['isWebAd']) {
        query.isWebAd = booleanFilters['isWebAd'];
      }

      if (selectedItems.length) {
        query.cargoTypes = selectedItems
          .map((item) => item)
          .join(', ');
      }

      if (origin?.country_id) {
        query.origin_city_id = origin.id;
        query.origin_country_id = origin.country_id;
      } else {
        query.origin_country_id = origin?.id;
      }

      if (destination && destination?.country_id) {
        query.destination_city_id = destination.id;
        query.destination_country_id = destination.country_id;
      } else {
        query.destination_country_id = destination?.id;
      }

      return query;
}

export function vehicleRequestParams(
  {
    page, 
    limit, 
    booleanFilters, 
    selectedCountry, 
    selectedCity,
    selectedItems
  }: 
  {
    limit: number, 
    page: number, 
    booleanFilters: any, 
    selectedCountry: any, 
    selectedCity: any
    selectedItems: string[]
  }) {
    let query: Record<string, any> = {
      limit: limit,
      page: page,
      sort: '!createdAt',
      isArchived: false,
      isDeleted: false,
    };
  
    if (booleanFilters['isDagruz']) {
      query.isDagruz = booleanFilters['isDagruz']; 
    }
  
    if (booleanFilters['isLikelyDispatcher']) {
      query.isLikelyDispatcher = booleanFilters['isLikelyDispatcher']; 
    }
  
    if (booleanFilters['isWebAd']) {
      query.isWebAd = booleanFilters['isWebAd']; 
    }
  
    if (selectedItems.length) {
      query.truckTypes = selectedItems.map((item) => item).join(', ');
    }
  
    if (selectedCountry) {
      query.origin_country_id = selectedCountry.id;
    }
  
    if (selectedCity) {
      query.origin_city_id = selectedCity.id;
    }
  
    return query;
  }

