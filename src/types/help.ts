import { z } from 'zod';

export const HelpArg = z.object({
    name: z.string(),
    notice: z.string().nullable(),
    type_repr: z.string().nullable(),
    optional: z.boolean(),
    hidden: z.boolean(),
    default: z.string().nullable(),
});

export const HelpOption = z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    dest: z.string(),
    args: z.array(HelpArg),
    help_text: z.string().nullable(),
});

export type HelpNodeT = {
    name: string;
    dest: string;
    aliases: string[];
    help_text: string | null;
    args: z.infer<typeof HelpArg>[];
    options: z.infer<typeof HelpOption>[];
    subcommands: HelpNodeT[];
};

export const HelpNode: z.ZodType<HelpNodeT> = z.lazy(() =>
    z.object({
        name: z.string(),
        dest: z.string(),
        aliases: z.array(z.string()),
        help_text: z.string().nullable(),
        args: z.array(HelpArg),
        options: z.array(HelpOption),
        subcommands: z.array(HelpNode),
    }),
);

export const HelpData = z.object({
    lang: z.string(),
    schema_version: z.literal(1),
    kind: z.literal('help'),
    command: HelpNode,
    breadcrumb: z.array(z.string()),
});
