import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import uz from '@/locales/uz.json';
import uzCyrl from '@/locales/uz-Cyrl.json';
import ru from '@/locales/ru.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'uz',
    lng: 'uz',
    debug: true,
    resources: {
      uz: {
        translation: uz,
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
