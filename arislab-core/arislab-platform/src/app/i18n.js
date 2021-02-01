import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import webpageEN from "./locales/en/webpage.json";
import productsEN from "./locales/en/products.json";
import attributesEN from "./locales/en/attributes.json";
import optionsEN from "./locales/en/options.json";
import webpageTH from "./locales/th/webpage.json";
import productsTH from "./locales/th/products.json";
import attributesTH from "./locales/th/attributes.json";
import optionsTH from "./locales/th/options.json";

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      webpage: webpageEN,
      products: productsEN,
      attributes: attributesEN,
      options: optionsEN,
    },
    th: {
      webpage: webpageTH,
      products: productsTH,
      attributes: attributesTH,
      options: optionsTH,
    },
  },
  fallbackLng: ["en", "th"],
  lng: localStorage.getItem("i18nextLng") || "th",
  ns: ["webpage", "products", "attributes"],
  defaultNS: "webpage",
});

export default i18n;
