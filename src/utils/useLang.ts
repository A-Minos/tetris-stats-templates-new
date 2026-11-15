import { z } from 'zod';
import useData from '~/utils/useData';

export default () => {
    try {
        const { availableLocales, setLocale } = useI18n();
        const data = useData(z.object({ lang: z.enum(availableLocales).optional() }).readonly());
        if (data.lang) setLocale(data.lang);
    } catch (e) {
        console.error(e);
    }
};
