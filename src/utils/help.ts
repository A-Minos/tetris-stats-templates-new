import type { HelpArg, HelpData, HelpNode, HelpShortcut } from '../types/help';

export type UsageToken = { text: string; kind: 'path' | 'required' | 'optional' | 'flag' };

export function renderArgToken(arg: HelpArg): string {
    const name = `${arg.name}${arg.variadic ? '...' : ''}`;
    return arg.optional ? `[${name}]` : `<${name}>`;
}

export function createUsageTokens(command: HelpNode, path: string[], boundOptions: string[] = []): UsageToken[] {
    const tokens: UsageToken[] = path.map((text) => ({ text, kind: 'path' }));
    for (const arg of command.args) {
        tokens.push({ text: renderArgToken(arg), kind: arg.optional ? 'optional' : 'required' });
    }
    for (const option of command.options) {
        if (boundOptions.includes(option.name)) continue;
        const inner = [option.name, ...option.args.map(renderArgToken)].join(' ');
        tokens.push({ text: `[${inner}]`, kind: 'flag' });
    }
    return tokens;
}

export function resolveShortcutTarget(command: HelpNode, breadcrumb: string[], target: string[]): HelpNode {
    let node = command;
    for (const name of target.slice(breadcrumb.length)) {
        const subcommand = node.subcommands.find((subcommand) => subcommand.name === name);
        if (!subcommand) {
            throw new Error(`Shortcut target "${target.join(' ')}" has no subcommand "${name}" in "${node.name}"`);
        }
        node = subcommand;
    }
    return node;
}

/** A shortcut resolved against the current page's command tree. */
export type ShortcutView = HelpShortcut & {
    node: HelpNode;
    tokens: UsageToken[];
    /** Help texts of the bound options; the target command's help text when nothing is bound. */
    notes: Array<string | null>;
};

export function describeShortcuts(data: HelpData): ShortcutView[] {
    return data.shortcuts.map((shortcut) => {
        const node = resolveShortcutTarget(data.command, data.breadcrumb, shortcut.target);
        return {
            ...shortcut,
            node,
            tokens: createUsageTokens(node, [shortcut.key], shortcut.bound_options),
            notes: shortcut.bound_options.length
                ? node.options
                      .filter((option) => shortcut.bound_options.includes(option.name))
                      .map((option) => option.help_text)
                : [node.help_text],
        };
    });
}
