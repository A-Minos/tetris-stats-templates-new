import assert from 'node:assert/strict';
import test from 'node:test';
import { HelpData, type HelpArg, type HelpNode } from '../src/types/help.ts';
import { createUsageTokens, renderArgToken, resolveShortcutTarget } from '../src/utils/help.ts';

const account: HelpArg = {
    name: 'account',
    notice: 'TETR.IO 账号',
    type_repr: 'str',
    optional: true,
    variadic: false,
    hidden: false,
    default: null,
};
const query: HelpNode = {
    name: 'query',
    dest: 'query',
    aliases: ['查询'],
    help_text: '查询 TETR.IO 游戏信息',
    args: [account],
    options: [
        { name: '--blitz', aliases: ['-b'], dest: 'blitz', help_text: 'Blitz 成绩', args: [] },
        { name: '--40l', aliases: [], dest: '40l', help_text: '40 行成绩', args: [] },
        {
            name: '--template',
            aliases: ['-T'],
            dest: 'template',
            help_text: '要使用的查询模板',
            args: [
                {
                    name: 'template',
                    notice: null,
                    type_repr: 'Template',
                    optional: false,
                    variadic: false,
                    hidden: false,
                    default: null,
                },
            ],
        },
    ],
    subcommands: [],
};
const tetrio: HelpNode = {
    name: 'TETR.IO',
    dest: 'TETRIO',
    aliases: ['io'],
    help_text: 'TETR.IO 游戏相关指令',
    args: [],
    options: [],
    subcommands: [query],
};
const root: HelpNode = {
    name: 'tetris-stats',
    dest: 'Alconna::tetris-stats',
    aliases: ['tstats'],
    help_text: '俄罗斯方块相关游戏数据查询',
    args: [],
    options: [],
    subcommands: [tetrio],
};
const payload: HelpData = {
    lang: 'zh-CN',
    command: root,
    breadcrumb: ['tetris-stats'],
    usage: null,
    examples: [],
    shortcuts: [{ key: 'io查', target: ['tetris-stats', 'TETR.IO', 'query'], bound_options: ['--blitz'] }],
};

test('root-page shortcut resolves its complete canonical path to the nested command', () => {
    assert.equal(resolveShortcutTarget(root, payload.breadcrumb, payload.shortcuts[0]!.target), query);
    assert.deepEqual(createUsageTokens(root, payload.breadcrumb), [{ text: 'tetris-stats', kind: 'path' }]);
});

test('deep-page shortcut removes the entire breadcrumb and can target the current node', () => {
    assert.equal(
        resolveShortcutTarget(tetrio, ['tetris-stats', 'TETR.IO'], ['tetris-stats', 'TETR.IO', 'query']),
        query,
    );
    assert.equal(
        resolveShortcutTarget(query, ['tetris-stats', 'TETR.IO', 'query'], ['tetris-stats', 'TETR.IO', 'query']),
        query,
    );
});

test('shortcut signatures exclude bound --blitz, retain --40l, and preserve argument order', () => {
    assert.deepEqual(createUsageTokens(query, ['io查'], ['--blitz']), [
        { text: 'io查', kind: 'path' },
        { text: '[account]', kind: 'optional' },
        { text: '[--40l]', kind: 'flag' },
        { text: '[--template <template>]', kind: 'flag' },
    ]);
    assert.deepEqual(createUsageTokens(query, ['tetris-stats', 'TETR.IO', 'query']), [
        { text: 'tetris-stats', kind: 'path' },
        { text: 'TETR.IO', kind: 'path' },
        { text: 'query', kind: 'path' },
        { text: '[account]', kind: 'optional' },
        { text: '[--blitz]', kind: 'flag' },
        { text: '[--40l]', kind: 'flag' },
        { text: '[--template <template>]', kind: 'flag' },
    ]);
});

test('required and optional variadic arguments share their renderer with usage signatures', () => {
    const required: HelpArg = { ...account, name: 'accounts', optional: false, variadic: true };
    const optional: HelpArg = { ...account, name: 'tags', variadic: true };
    const command: HelpNode = {
        ...query,
        args: [required, optional],
        options: [
            { name: '--compare', aliases: [], dest: 'compare', help_text: '对比账号', args: [required, optional] },
        ],
    };
    assert.equal(renderArgToken(required), '<accounts...>');
    assert.equal(renderArgToken(optional), '[tags...]');
    assert.deepEqual(createUsageTokens(command, ['io查']), [
        { text: 'io查', kind: 'path' },
        { text: '<accounts...>', kind: 'required' },
        { text: '[tags...]', kind: 'optional' },
        { text: '[--compare <accounts...> [tags...]]', kind: 'flag' },
    ]);
});

test('shortcut protocol errors stay visible instead of falling back or resolving aliases', () => {
    assert.throws(
        () => resolveShortcutTarget(tetrio, ['tetris-stats', 'TETR.IO'], ['tetris-stats', 'tos', 'query']),
        /outside "tetris-stats TETR.IO"/,
    );
    assert.throws(
        () => resolveShortcutTarget(root, ['tetris-stats'], ['tetris-stats', 'io', 'query']),
        /no subcommand "io"/,
    );
});

test('backend help payload requires explicit variadic and bound_options fields', () => {
    assert.deepEqual(HelpData.parse(payload), payload);
    const { variadic, ...oldArg } = account;
    const { bound_options, ...oldShortcut } = payload.shortcuts[0]!;
    const missingVariadic = HelpData.safeParse({ ...payload, command: { ...root, args: [oldArg] } });
    const missingBoundOptions = HelpData.safeParse({ ...payload, shortcuts: [oldShortcut] });
    assert.equal(missingVariadic.success, false);
    assert.equal(missingBoundOptions.success, false);
    if (!missingVariadic.success) {
        assert.deepEqual(missingVariadic.error.issues[0]!.path, ['command', 'args', 0, 'variadic']);
    }
    if (!missingBoundOptions.success) {
        assert.deepEqual(missingBoundOptions.error.issues[0]!.path, ['shortcuts', 0, 'bound_options']);
    }
});
