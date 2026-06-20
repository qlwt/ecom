import resources from "@client/i18n/resources.json"
import i18 from "i18next"
import * as ri18 from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

export const i18n_resources = resources
export const i18n_fallbacklang: keyof typeof i18n_resources = "en"

declare module "i18next" {
    interface CustomTypeOptions {
        resources: typeof i18n_resources[typeof i18n_fallbacklang],
    }
}

i18.use(LanguageDetector).use(ri18.initReactI18next).init({
    resources: i18n_resources,

    fallbackLng: i18n_fallbacklang,

    interpolation: {
        escapeValue: false
    },

    detection: {
        lookupLocalStorage: "i18n__lang",

        convertDetectedLanguage: lng => {
            const lng_pure = lng.toLowerCase().slice(0, 2)

            if (Object.keys(i18n_resources).includes(lng_pure)) {
                return lng_pure
            }

            return i18n_fallbacklang
        },

        caches: ["localStorage"],
        order: ["localStorage", "navigator"],
    }
})
