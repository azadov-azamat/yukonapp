import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import uz from '@/locales/uz.json';
import uzCyrl from '@/locales/uz-Cyrl.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'uz',
    lng: 'uz',
    debug: false,
    resources: {
      uz: {
        translation: uz,
      },
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
      'uz-Cyrl': {
        translation: uzCyrl,
      }
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
