import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import webpageEN from '../EN/webpage.json';
import webpageTH from '../TH/webpage.json';

i18n.use(LanguageDetector).init({

    resources: {
        en: { webpage: webpageEN},
        th: { webpage: webpageTH}
    },
    fallbackLng: ["en", "th"],
    lng: 'th',
    // namespace
    ns: ["webpage"],
    defaultNS: "webpage"
    // interpolation: {
    //     escapeValue: false
    // },
    // react: { wait: true }

});

export default i18n;