<script lang="ts" setup>
import HelpPage from '~/pages/help.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    // Root command
    await addPage(
        {
            lang: 'zh-CN',
            schema_version: 1,
            kind: 'help',
            breadcrumb: ['tstats'],
            command: {
                name: 'tstats',
                dest: 'Alconna::tstats',
                aliases: ['tetris-stats'],
                help_text: '俄罗斯方块相关游戏数据查询',
                args: [],
                options: [],
                subcommands: [
                    {
                        name: 'TETR.IO',
                        dest: 'TETRIO',
                        aliases: ['io', 'TETRIO'],
                        help_text: 'TETR.IO 游戏相关指令',
                        args: [],
                        options: [],
                        subcommands: [],
                    },
                    {
                        name: 'tos',
                        dest: 'tos',
                        aliases: ['茶服'],
                        help_text: '茶服 游戏相关指令',
                        args: [],
                        options: [],
                        subcommands: [],
                    },
                    {
                        name: 'top',
                        dest: 'top',
                        aliases: [],
                        help_text: 'TOP 游戏相关指令',
                        args: [],
                        options: [],
                        subcommands: [],
                    },
                ],
            },
        },
        HelpPage,
    );

    // Subcommand with options + subcommands
    await addPage(
        {
            lang: 'zh-CN',
            schema_version: 1,
            kind: 'help',
            breadcrumb: ['tstats', 'TETR.IO'],
            command: {
                name: 'TETR.IO',
                dest: 'TETRIO',
                aliases: ['io', 'TETRIO'],
                help_text: 'TETR.IO 游戏相关指令',
                args: [],
                options: [
                    {
                        name: '--flag',
                        aliases: ['-f'],
                        dest: 'flag',
                        help_text: '一个旗标',
                        args: [],
                    },
                ],
                subcommands: [
                    {
                        name: 'query',
                        dest: 'query',
                        aliases: ['查询'],
                        help_text: '查询 TETR.IO 游戏信息',
                        args: [],
                        options: [],
                        subcommands: [],
                    },
                    {
                        name: 'rank',
                        dest: 'rank',
                        aliases: [],
                        help_text: '查询 TETR.IO 段位信息',
                        args: [],
                        options: [],
                        subcommands: [],
                    },
                    {
                        name: 'bind',
                        dest: 'bind',
                        aliases: ['绑定'],
                        help_text: '绑定 TETR.IO 账号',
                        args: [],
                        options: [],
                        subcommands: [],
                    },
                ],
            },
        },
        HelpPage,
    );

    // Deep subcommand with positional args + nuanced options
    await addPage(
        {
            lang: 'zh-CN',
            schema_version: 1,
            kind: 'help',
            breadcrumb: ['tstats', 'TETR.IO', 'query'],
            command: {
                name: 'query',
                dest: 'query',
                aliases: ['查询'],
                help_text: '查询 TETR.IO 游戏信息',
                args: [
                    {
                        name: 'account',
                        notice: 'TETR.IO 账号 (用户名 / ID / @ 提及)',
                        type_repr: 'str',
                        optional: false,
                        hidden: false,
                        default: null,
                    },
                ],
                options: [
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
                                hidden: false,
                                default: null,
                            },
                        ],
                    },
                    {
                        name: '--offset',
                        aliases: [],
                        dest: 'offset',
                        help_text: '指定对比时间距离',
                        args: [
                            {
                                name: 'offset',
                                notice: null,
                                type_repr: 'duration',
                                optional: true,
                                hidden: false,
                                default: 'None',
                            },
                        ],
                    },
                ],
                subcommands: [],
            },
        },
        HelpPage,
    );
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
