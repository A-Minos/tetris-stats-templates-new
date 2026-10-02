import type { FormatDistanceToNowOptions, Locale } from 'date-fns';
import { enUS, es, ja, ko, zhCN, zhTW } from 'date-fns/locale';
import type { Language } from '~/constants/enum/languages';

const dateFnsMapping = {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS,
    'es-ES': es,
    'ja-JP': ja,
    'ko-KR': ko,
} satisfies Record<Language, Locale>;

function getDateFnsLocale(locale: string) {
    const dateFnsLocale = dateFnsMapping[locale as Language];
    if (!dateFnsLocale) throw new Error(`Unsupported locale: ${locale}`);
    return dateFnsLocale;
}

export function formatDateFns(
    formater: (options?: FormatDistanceToNowOptions) => string,
    options?: FormatDistanceToNowOptions,
): Ref<string> {
    const nuxtApp = useNuxtApp();
    const { locale } = useI18n();

    const formatedText = ref(formater({ ...options, locale: getDateFnsLocale(locale.value) }));

    nuxtApp.hook('i18n:beforeLocaleSwitch', ({ newLocale }) => {
        formatedText.value = formater({ ...options, locale: getDateFnsLocale(newLocale) });
    });

    return formatedText;
}
