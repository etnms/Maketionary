import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

import en from "./locales/en/translation.json";
import fr from "./locales/fr/translation.json";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
 };
i18n
  // i18next-http-backend
  // loads translations from your server
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: "en",
    resources,
    interpolation: {
      escapeValue: false, 
    },
    
    backend: {
      loadPath: 'https://etnms.github.io/Maketionary/locales/en/translation.json',
    },

  });

export default i18n;
