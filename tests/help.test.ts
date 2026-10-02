import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { HelpData, type HelpArg, type HelpNode } from '../src/types/help.ts';
import { createUsageTokens, describeShortcuts, renderArgToken, resolveShortcutTarget } from '../src/utils/help.ts';

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

const samples: Record<string, Record<string, unknown>> = JSON.parse(
    readFileSync(new URL('../src/dev-pages/help/samples.json', import.meta.url), 'utf8'),
);

test('real backend samples validate and all shortcut targets resolve in their command subtrees', () => {
    for (const pages of Object.values(samples)) {
        for (const sample of Object.values(pages)) {
            const data = HelpData.parse(sample);
            for (const shortcut of data.shortcuts) {
                resolveShortcutTarget(data.command, data.breadcrumb, shortcut.target);
            }
        }
    }
});

test('real Blitz and 40L shortcuts omit only the mode that is already bound', () => {
    const data = HelpData.parse(samples['zh-CN']!['TETR.IO record']);
    assert.deepEqual(
        data.shortcuts.map((shortcut) =>
            createUsageTokens(data.command, [shortcut.key], shortcut.bound_options)
                .map((token) => token.text)
                .join(' '),
        ),
        ['io记录blitz <who> [--40l]', 'io记录40l <who> [--blitz]'],
    );
});

test('real mask add and regex rank shortcuts retain their actual backend signatures', () => {
    const mask = HelpData.parse(samples['zh-CN']!['TETR.IO mask add']);
    assert.equal(
        createUsageTokens(mask.command, [mask.shortcuts[0]!.key])
            .map((token) => token.text)
            .join(' '),
        'io屏蔽 <account> [fields...]',
    );
    const rank = HelpData.parse(samples['zh-CN']!['TETR.IO rank']);
    assert.deepEqual(createUsageTokens(rank.command, [rank.shortcuts[0]!.key]), [{ text: 'iorank', kind: 'path' }]);
});

test('mode shortcuts are explained by their bound option, others by their target command', () => {
    const record = describeShortcuts(HelpData.parse(samples['zh-CN']!['TETR.IO record']));
    assert.deepEqual(
        record.map((shortcut) => shortcut.notes),
        [['查询 Blitz 记录'], ['查询 40行记录']],
    );
    const root = describeShortcuts(HelpData.parse(samples['zh-CN']!.root));
    const maskList = root.find((shortcut) => shortcut.key === 'io屏蔽列表')!;
    assert.deepEqual(maskList.notes, [maskList.node.help_text]);
    assert.equal(maskList.node.name, 'list');
});
