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

export const formatPrice = (x: number, hideSign?: boolean): string => {
    if (!x) return '0';
    let result = x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (x < 20000 && x > 100) {
        if (hideSign) {
          return result;
        }
        return '$' + result;
      }

      if (x <= 50) {
        return result + '%';
      }

      return result;
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
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Telegram app not installed!');
    }
  } catch (error) {
    console.error('Failed to open Telegram:', error);
    Alert.alert('Error', 'Unable to open Telegram.');
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
