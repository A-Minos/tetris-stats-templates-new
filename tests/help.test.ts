import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { HelpData, type HelpArg, type HelpCommand, type HelpShortcut } from '../src/types/help.ts';
import { createUsageTokens, renderArgToken } from '../src/utils/help.ts';

const account: HelpArg = {
    name: 'account',
    description: 'TETR.IO 账号',
    optional: true,
    variadic: false,
    default: null,
};
const query: HelpCommand = {
    name: 'query',
    aliases: ['查询'],
    description: '查询 TETR.IO 游戏信息',
    args: [account],
    options: [
        { name: '--blitz', aliases: ['-b'], description: 'Blitz 成绩', args: [] },
        { name: '--40l', aliases: [], description: '40 行成绩', args: [] },
        {
            name: '--template',
            aliases: ['-T'],
            description: '要使用的查询模板',
            args: [
                {
                    name: 'template',
                    description: 'Template',
                    optional: false,
                    variadic: false,
                    default: null,
                },
            ],
        },
    ],
    subcommands: [],
    shortcuts: [],
};
const tetrio: HelpCommand = {
    name: 'TETR.IO',
    aliases: ['io'],
    description: 'TETR.IO 游戏相关指令',
    args: [],
    options: [],
    subcommands: [query],
    shortcuts: [],
};
const root: HelpCommand = {
    name: 'tetris-stats',
    aliases: ['tstats'],
    description: '俄罗斯方块相关游戏数据查询',
    args: [],
    options: [],
    subcommands: [tetrio],
    shortcuts: [],
};
const payload: HelpData = {
    lang: 'zh-CN',
    command: root,
    breadcrumb: ['tetris-stats'],
    usage: null,
    examples: [],
};

test('shortcut signatures render the supplied remaining inputs without resolving a command', () => {
    const shortcut: HelpShortcut = {
        label: 'io查',
        args: [account],
        options: [{ name: '--40l', aliases: [], description: '40 行成绩', args: [] }],
        notes: ['Blitz 成绩'],
    };
    assert.deepEqual(createUsageTokens(shortcut, [shortcut.label]), [
        { text: 'io查', kind: 'path' },
        { text: '[account]', kind: 'optional' },
        { text: '[--40l]', kind: 'flag' },
    ]);
});

test('normal usage retains the full path and every option', () => {
    assert.deepEqual(createUsageTokens(root, payload.breadcrumb), [{ text: 'tetris-stats', kind: 'path' }]);
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
    const command: HelpCommand = {
        ...query,
        args: [required, optional],
        options: [{ name: '--compare', aliases: [], description: '对比账号', args: [required, optional] }],
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

test('backend help payload requires variadic and node-local shortcut inputs explicitly', () => {
    assert.deepEqual(HelpData.parse(payload), payload);
    const { variadic, ...oldArg } = account;
    const missingVariadic = HelpData.safeParse({ ...payload, command: { ...root, args: [oldArg] } });
    assert.equal(missingVariadic.success, false);
    if (!missingVariadic.success) {
        assert.deepEqual(missingVariadic.error.issues[0]!.path, ['command', 'args', 0, 'variadic']);
    }
    const missingShortcutInputs = HelpData.safeParse({
        ...payload,
        command: { ...root, shortcuts: [{ label: 'io查' }] },
    });
    assert.equal(missingShortcutInputs.success, false);
    if (!missingShortcutInputs.success) {
        assert.deepEqual(
            missingShortcutInputs.error.issues.map((issue) => issue.path),
            [
                ['command', 'shortcuts', 0, 'args'],
                ['command', 'shortcuts', 0, 'options'],
                ['command', 'shortcuts', 0, 'notes'],
            ],
        );
    }
});

const samples: Record<string, Record<string, unknown>> = JSON.parse(
    readFileSync(new URL('../src/dev-pages/help/samples.json', import.meta.url), 'utf8'),
);

test('real backend samples validate without dropping fields', () => {
    for (const pages of Object.values(samples)) {
        for (const sample of Object.values(pages)) {
            assert.deepEqual(HelpData.parse(sample), sample);
        }
    }
});

test('real Blitz and 40L shortcuts omit only the mode that is already bound', () => {
    const data = HelpData.parse(samples['zh-CN']!['TETR.IO record']);
    assert.deepEqual(
        data.command.shortcuts.map((shortcut) =>
            createUsageTokens(shortcut, [shortcut.label])
                .map((token) => token.text)
                .join(' '),
        ),
        [
            'io记录blitz <who> [--type <record_type>] [--index <index>] [--40l]',
            'io记录40l <who> [--type <record_type>] [--index <index>] [--blitz]',
        ],
    );
});

test('real mask add and regex rank shortcuts retain their actual backend signatures', () => {
    const mask = HelpData.parse(samples['zh-CN']!['TETR.IO mask add']);
    assert.equal(
        createUsageTokens(mask.command.shortcuts[0]!, [mask.command.shortcuts[0]!.label])
            .map((token) => token.text)
            .join(' '),
        'io屏蔽 <account> [fields...]',
    );
    const rank = HelpData.parse(samples['zh-CN']!['TETR.IO rank']);
    const shortcut = rank.command.shortcuts[0]!;
    assert.deepEqual(createUsageTokens(shortcut, [shortcut.label]), [{ text: 'iorank', kind: 'path' }]);
});

test('shortcuts belong to their target nodes and retain mode and command explanations', () => {
    const record = HelpData.parse(samples['zh-CN']!['TETR.IO record']).command;
    assert.deepEqual(
        record.shortcuts.map((shortcut) => shortcut.notes),
        [['查询 Blitz 记录'], ['查询 40行记录']],
    );
    const root = HelpData.parse(samples['zh-CN']!.root).command;
    const tetrio = root.subcommands.find((command) => command.name === 'TETR.IO')!;
    const mask = tetrio.subcommands.find((command) => command.name === 'mask')!;
    const maskList = mask.subcommands.find((command) => command.name === 'list')!;
    assert.deepEqual(root.shortcuts, []);
    assert.deepEqual(tetrio.shortcuts, []);
    assert.deepEqual(mask.shortcuts, []);
    assert.deepEqual(
        maskList.shortcuts.map((shortcut) => shortcut.label),
        ['io屏蔽列表'],
    );
    assert.deepEqual(maskList.shortcuts[0]!.notes, [maskList.description]);
});
