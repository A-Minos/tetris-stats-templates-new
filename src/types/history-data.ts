import { z } from 'zod';

const historyData = z.array(
    z.object({
        score: z.number(),
        record_at: z.coerce.date(),
    }),
);
type historyData = z.infer<typeof historyData>;
type historyDataType = z.infer<typeof historyData>;

export default historyData;
export type { historyDataType };
