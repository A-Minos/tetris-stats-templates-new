import { z } from 'zod';

export const HelpArg = z.object({
    name: z.string(),
    description: z.string(),
    optional: z.boolean(),
    variadic: z.boolean(),
    default: z.string().nullable(),
});

export type HelpArg = z.infer<typeof HelpArg>;

export const HelpOption = z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    args: z.array(HelpArg),
    description: z.string().nullable(),
});

export type HelpOption = z.infer<typeof HelpOption>;

export const HelpShortcut = z.object({
    label: z.string(),
    args: z.array(HelpArg),
    options: z.array(HelpOption),
    notes: z.array(z.string()),
});

export type HelpShortcut = z.infer<typeof HelpShortcut>;

export const HelpCommand = z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    description: z.string().nullable(),
    args: z.array(HelpArg),
    options: z.array(HelpOption),
    get subcommands() {
        return z.array(HelpCommand);
    },
    shortcuts: z.array(HelpShortcut),
});

export type HelpCommand = z.infer<typeof HelpCommand>;

export const HelpData = z.object({
    lang: z.string(),
    command: HelpCommand,
    breadcrumb: z.array(z.string()),
    usage: z.string().nullable(),
    examples: z.array(z.string()),
});

export type HelpData = z.infer<typeof HelpData>;
