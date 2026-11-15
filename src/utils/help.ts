import type { HelpArg, HelpCommand } from '../types/help';

export type UsageToken = { text: string; kind: 'path' | 'required' | 'optional' | 'flag' };

export function renderArgToken(arg: HelpArg): string {
    const name = `${arg.name}${arg.variadic ? '...' : ''}`;
    return arg.optional ? `[${name}]` : `<${name}>`;
}

export function createUsageTokens(command: Pick<HelpCommand, 'args' | 'options'>, path: string[]): UsageToken[] {
    const tokens: UsageToken[] = path.map((text) => ({ text, kind: 'path' }));
    for (const arg of command.args) {
        tokens.push({ text: renderArgToken(arg), kind: arg.optional ? 'optional' : 'required' });
    }
    for (const option of command.options) {
        const inner = [option.name, ...option.args.map(renderArgToken)].join(' ');
        tokens.push({ text: `[${inner}]`, kind: 'flag' });
    }
    return tokens;
}
