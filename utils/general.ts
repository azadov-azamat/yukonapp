import { Deserializer } from "jsonapi-serializer";
import {AuthDataProps} from "@/interface/redux/auth.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserModel from "@/models/user";
import { IUserModel } from "@/interface/redux/user.interface";
import { ILoadModel } from "@/interface/redux/load.interface";
import LoadModel from "@/models/load";
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
  console.log(currentLanguage);
  
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
// console.log(city);

    const uzKey = city?.name_uz || city?.nameUz;
    const ruKey = city?.name_ru || city?.nameRu;

    const fallbackText = i18n.t('truck-type.not_specified');

    // Return the value based on the current language
    return currentLanguage === 'uz' ? uzKey || fallbackText : ruKey || fallbackText;
}
  

export const formatPrice = (price: number | null | undefined): string => {
    if (!price) {
      return '0';
    }
  
    // Narxni bo'laklarga ajratish va formatlash
    return price.toLocaleString('en-US');
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

export const deserializeUser = (data: IUserModel): UserModel => {
    return new UserModel(data);
};

export const deserializeLoad = (data: ILoadModel): LoadModel => {
    return new LoadModel(data);
};
