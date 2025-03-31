import { z } from 'zod';
import useData from '~/composables/useData';
import Languages from '~/core/shared/languages';
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
