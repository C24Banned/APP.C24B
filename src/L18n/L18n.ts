import { createI18n } from 'vue-i18n'
import { lang } from "@idc/Config/Config.ts";

//
import ru from "./ru.json5";
import en from "./en.json5";

//
export default createI18n({
    legacy: false,
    locale: lang,//'ru',
    fallbackLocale: 'en',
    messages: { en, ru }
});
