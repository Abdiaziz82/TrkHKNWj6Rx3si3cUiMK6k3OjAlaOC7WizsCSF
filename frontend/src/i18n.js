import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation.json";
import swTranslation from "./locales/sw/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      sw: { translation: swTranslation },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already escapes
    },
  });

export default i18n;
