import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import ar from "./locales/ar/translation.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ar: { translation: ar },
};

export const rtlLanguages = ["ar", "fa", "he", "ur"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "ar"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
