import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import your translation files
import dashboardEN from './locales/en/Das.json';
import dashboardUR from './locales/ur/Das.json';
import HeadEN from './locales/en/Head.json';
import HeadUR from './locales/ur/Head.json';
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
import DashEN from './localesT/en/Das.json';
import DashUR from './localesT/ur/Das.json';
import GigEN from './localesT/en/Gig.json';
import GigUR from './localesT/ur/Gig.json';
import BarSEN from './locales/en/Bar.json';
import BarSUR from './locales/ur/Bar.json';
import BarEN from './localesT/en/Bar.json';
import BarUR from './localesT/ur/Bar.json';
import OrdEN from './localesT/en/Ord.json';
import OrdUR from './localesT/ur/Ord.json';
import OrdSEN from './locales/en/Ord.json';
import OrdSUR from './locales/ur/Ord.json';
import ShopEN from './locales/en/Shop.json';
import ShopUR from './locales/ur/Shop.json';




const resources = {
  en: {
    translation: {
      ...dashboardEN,
      ...sellerStatisticsEN,
      ...sellerHomeEN,
      ...SellerProEN,
      ...SellerProdEN,
      ...DashEN,
      ...GigEN,
      ...BarEN,
      ...BarSEN,
      ...OrdEN,
      ...HeadEN,
      ...OrdSEN,
      ...ShopEN,



      

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
      ...DashUR,
      ...GigUR,
      ...BarUR,
      ...BarSUR,
      ...OrdUR,
      ...HeadUR,
      ...OrdSUR,
      ...ShopUR,




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
