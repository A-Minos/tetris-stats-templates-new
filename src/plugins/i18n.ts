import type { FormatDistanceToNowOptions } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { z } from 'zod';
import Languages from '~/constants/enum/languages';
import useData from '~/utils/useData';

const dateFnsMapping = {
    'zh-CN': zhCN,
    'en-US': enUS,
};

export function formatDateFns(
    formater: (options?: FormatDistanceToNowOptions) => string,
    options?: FormatDistanceToNowOptions,
): Ref<string> {
    const nuxtApp = useNuxtApp();
    const { locale } = useI18n();

    const formatedText = ref(formater({ ...options, locale: dateFnsMapping[locale.value] }));

    nuxtApp.hook('i18n:beforeLocaleSwitch', ({ newLocale }) => {
        formatedText.value = formater({ ...options, locale: dateFnsMapping[newLocale] });
    });

    return formatedText;
}

export default defineNuxtPlugin((app) => {
    app.hooks.addHooks({
        'app:created': () => {
            try {
                const data = useData(
                    z
                        .object({
                            _lang: z.nativeEnum(Languages).optional(),
                        })
                        .readonly(),
                );
                if (!data._lang) {
                    return;
                }
                const nuxtApp = useNuxtApp();
                nuxtApp.$i18n.locale.value = data._lang;
            } catch (e) {
                console.error(e);
                return;
            }
        },
    });
});
