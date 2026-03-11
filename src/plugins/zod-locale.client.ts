import { z } from 'zod';
import { en, zhCN } from 'zod/locales';

const localeMapping = {
    'en-US': en,
    'zh-CN': zhCN,
} as const;

function applyZodLocale(locale: string): void {
    const createLocale = localeMapping[locale as keyof typeof localeMapping] ?? en;
    z.config(createLocale());
}

export default defineNuxtPlugin(() => {
    const nuxtApp = useNuxtApp();
    const { locale } = nuxtApp.$i18n;

    applyZodLocale(locale.value);

    nuxtApp.hook('i18n:beforeLocaleSwitch', ({ newLocale }) => {
        applyZodLocale(newLocale);
    });
});
