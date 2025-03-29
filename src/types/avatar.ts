import { z } from 'zod';
import Identicon from './identicon';

const Avatar = z.union([Identicon, z.string()]);

type Avatar = z.infer<typeof Avatar>;

export default Avatar;
