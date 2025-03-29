import { z } from 'zod';

export default <T extends z.ZodReadonly<z.ZodObject<any, any, any, any, any> | z.ZodUnion<any>>>(
    model: T,
): z.infer<T> => {
    return model.parse(JSON.parse(window.__DATA__));
};
