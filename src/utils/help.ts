import type { HelpArg, HelpNode } from '../types/help';

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
