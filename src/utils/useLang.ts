import { z } from 'zod';
import Languages from '~/constants/enum/languages';
import useData from '~/utils/useData';

export default () => {
    try {
        const data = useData(z.object({ lang: z.enum(Languages).optional() }).readonly());
        if (data.lang) useI18n().setLocale(data.lang);
    } catch (e) {
        console.error(e);
    }
};
