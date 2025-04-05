import { z } from 'zod';

const Zenith = z.object({
    week: z
        .object({
            altitude: z.number(),
            global_rank: z.number().nullable(),
            country_rank: z.number().nullable(),
            play_at: z.coerce.date(),
        })
        .nullable(),

    best: z
        .object({
            altitude: z.number(),
            global_rank: z.number().nullable(),
            play_at: z.coerce.date(),
        })
        .nullable(),
});

type Zenith = z.infer<typeof Zenith>;

export default Zenith;
export { Zenith };
