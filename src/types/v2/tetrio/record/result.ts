import { z } from 'zod';

const Result = z
    .object({
        user: z.object({
            country: z.string().nullable(),
        }),
        query: z.object({
            type: z.enum(['top', 'recent', 'progression']),
            index: z.number().int().positive(),
        }),
        global_rank: z.number().int().positive().nullable(),
        country_rank: z.number().int().positive().nullable(),
        personal_best: z.enum(['current', 'former']).nullable(),
        disputed: z.boolean(),
        play_at: z.coerce.date(),
    })
    .readonly();

type Result = z.infer<typeof Result>;

export { Result };
export default Result;
