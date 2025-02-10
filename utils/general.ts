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

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const dateFromNow = (value: string | Date): string => {
  let dayjsLocale = 'uz'; // Default locale
  const currentLanguage = i18n.language;
  
  switch (currentLanguage) {
    case 'ru':
      dayjsLocale = 'ru';
      break;
    case 'uz':
      dayjsLocale = 'uz-latn';
      break;
    case 'uz-Cyrl':
      dayjsLocale = 'uz'; // `uz` in dayjs handles Cyrillic
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

export function getName(object: any, key: string): string {
    const currentLanguage = i18n.language;

    const uzKey = object[key + '_uz'] || object[key + 'Uz'];
    const ruKey = object[key + '_ru'] || object[key + 'Ru'];
    const cyrlKey = object[key + '_cyrl'] || object[key + 'Cyrl'];

    const fallbackText = i18n.t('truck-type.not_specified');

    // Return the value based on the current language
    return currentLanguage === 'uz' ? uzKey || fallbackText : ruKey || fallbackText;
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
  
