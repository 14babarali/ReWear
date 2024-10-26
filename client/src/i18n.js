import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import your translation files
import dashboardEN from './locales/en/Das.json';
import dashboardUR from './locales/ur/Das.json';
import sellerStatisticsEN from './locales/en/Sta.json';
import sellerStatisticsUR from './locales/ur/Sta.json';
import sellerHomeEN from './locales/en/Home.json';
import sellerHomeUR from './locales/ur/Home.json';
import SellerProEN from './locales/en/Prof.json';
import SellerProUR from './locales/ur/Prof.json';
import SellerProdEN from './locales/en/Prod.json';
import SellerProdUR from './locales/ur/Prod.json';
import SideEn from './locales/en/Side.json';
import SideUr from './locales/ur/Side.json';


const resources = {
  en: {
    translation: {
      ...dashboardEN,
      ...sellerStatisticsEN,
      ...sellerHomeEN,
      ...SellerProEN,
      ...SellerProdEN,
      ...SideEn,

    },
  },
  ur: {
    translation: {
      ...dashboardUR,
      ...sellerStatisticsUR,
      ...sellerHomeUR,
      ...SellerProUR,
      ...SellerProdUR,
      ...SideUr,
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already safe from XSS
    },
  });

export default i18n;
