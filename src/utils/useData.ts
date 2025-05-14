import { z } from 'zod';

export default <T extends z.ZodReadonly<z.ZodObject<any, any, any, any, any> | z.ZodUnion<any>>>(
    model: T,
): z.infer<T> => {
    try {
        return model.parse(JSON.parse(window.__DATA__));
    } catch (e) {
        console.error('Error parsing data:', e);
    }
};
