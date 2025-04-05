import { z } from 'zod';
import Languages from '~/constants/enum/languages';
import useData from '~/utils/useData';

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
                const { setLocale } = useI18n();
                setLocale(data._lang);
            } catch (e) {
                console.error(e);
                return;
            }
        },
    });
});
