import useData from "~/composables/useData";
import Languages from "~/core/shared/languages";
import { isNonNullish } from "remeda"

export default defineNuxtPlugin((app) => {
    app.hooks.addHooks({
        'app:created': () => {
            const data = useData<{
                readonly _lang: Languages;
            }>();

            if (isNonNullish(data._lang)) {
                const { setLocale } = useI18n()
                setLocale(data._lang)
            }
        },
    });
});