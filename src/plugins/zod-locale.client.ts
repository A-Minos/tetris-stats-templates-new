import { z } from 'zod';
import { en, es, ja, ko, zhCN, zhTW } from 'zod/locales';
import type { Language } from '~/constants/enum/languages';

const localeMapping = {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': en,
    'es-ES': es,
    'ja-JP': ja,
    'ko-KR': ko,
} satisfies Record<Language, typeof en>;

function applyZodLocale(locale: string): void {
    const createLocale = localeMapping[locale as Language];
    if (!createLocale) throw new Error(`Unsupported locale: ${locale}`);
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
