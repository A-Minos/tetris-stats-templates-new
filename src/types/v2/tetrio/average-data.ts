import { z } from 'zod';

export const AverageData = z.object({
    pps: z.number(),
    apm: z.number(),
    apl: z.number(),
    vs: z.number(),
    adpl: z.number(),
});

export type AverageData = z.infer<typeof AverageData>;
