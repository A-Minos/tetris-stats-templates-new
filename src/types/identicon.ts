import { z } from 'zod';

const Identicon = z.object({
    type: z.literal('identicon'),
    hash: z.string(),
});

type Identicon = z.infer<typeof Identicon>;

export default Identicon;
