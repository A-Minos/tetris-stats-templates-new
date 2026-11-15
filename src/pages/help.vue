<script lang="ts" setup>
import '~/styles/help.css';
import { HelpData } from '~/types/help';
import { describeShortcuts } from '~/utils/help';

const data = useData(HelpData);
const { t } = useI18n();
useLang();

const isRoot = data.breadcrumb.length === 1;
const shortcuts = describeShortcuts(data);
// Shortcuts for deeper commands are listed on their command tiles.
const ownShortcuts = data.command.subcommands.length
    ? shortcuts.filter((shortcut) => shortcut.node === data.command)
    : shortcuts;
const helpCommand = computed(() =>
    [data.breadcrumb.join(' '), ...(data.command.subcommands.length ? [`<${t('help.subcommand')}>`] : [])].join(' '),
);
// Games with only a few commands share a row instead of leaving most of a full-width row empty.
const isWideGame = (commandCount: number) => commandCount > 4;
</script>

<template>
    <help-layout>
        <header class="flex flex-col gap-[6px] pb-6 border-b-1 border-b-solid border-[var(--help-line)]">
            <code v-if="!isRoot" class="[font-family:var(--help-mono)] text-[13px] text-[var(--help-text-3)]">{{
                data.breadcrumb.join(' / ')
            }}</code>
            <h1
                class="flex items-baseline flex-wrap gap-[14px] m-0 [font-family:var(--help-display)] text-[44px] font-800 leading-[1.1]"
            >
                {{ data.command.name }}
                <span
                    v-if="data.command.aliases.length"
                    class="[font-family:var(--help-mono)] text-[14px] font-400 text-[var(--help-text-3)]"
                >
                    {{ data.command.aliases.join(' / ') }}
                </span>
            </h1>
            <p v-if="data.command.help_text" class="m-0 text-[18px] text-[var(--help-text-2)]">
                {{ data.command.help_text }}
            </p>
            <p
                v-if="data.usage"
                class="max-w-[760px] mt-2 mb-0 mx-0 text-[15px] leading-[1.75] text-[var(--help-text-2)] whitespace-pre-line"
            >
                {{ data.usage }}
            </p>
        </header>

        <div v-if="isRoot" class="grid grid-cols-2 gap-x-5 gap-y-7">
            <section
                v-for="game in data.command.subcommands"
                :key="game.dest"
                class="flex flex-col gap-3"
                :class="{ 'col-span-full': isWideGame(game.subcommands.length) }"
            >
                <div class="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                    <h2 class="m-0 [font-family:var(--help-display)] text-[26px] font-800 leading-[1.2]">
                        {{ game.name }}
                    </h2>
                    <code
                        v-if="game.aliases.length"
                        class="[font-family:var(--help-mono)] text-[14px] font-400 text-[var(--help-text-3)]"
                        >{{ game.aliases.join(' / ') }}</code
                    >
                    <span v-if="game.help_text" class="ml-auto text-[14px] text-[var(--help-text-3)]">{{
                        game.help_text
                    }}</span>
                </div>
                <shared-help-command-grid
                    :commands="game.subcommands"
                    :path="[...data.breadcrumb, game.name]"
                    :shortcuts="shortcuts"
                    :columns="isWideGame(game.subcommands.length) ? 3 : 2"
                />
            </section>
        </div>

        <template v-else>
            <shared-help-view :command="data.command" :breadcrumb="data.breadcrumb" />
            <shared-help-section v-if="data.command.subcommands.length" :title="$t('help.subcommands')">
                <shared-help-command-grid
                    :commands="data.command.subcommands"
                    :path="data.breadcrumb"
                    :shortcuts="shortcuts"
                    :columns="3"
                />
            </shared-help-section>
            <shared-help-section v-if="ownShortcuts.length" :title="$t('help.shortcuts')">
                <div
                    class="px-5 py-4 border-1 border-solid border-[var(--help-line)] rounded-[6px] bg-[var(--help-panel)] flex flex-col gap-2"
                >
                    <shared-help-shortcut
                        v-for="shortcut in ownShortcuts"
                        :key="shortcut.key"
                        :shortcut="shortcut"
                        :context="data.command"
                    />
                </div>
            </shared-help-section>
        </template>

        <shared-help-section v-if="data.examples.length" :title="$t('help.examples')">
            <ul
                class="px-5 py-4 border-1 border-solid border-[var(--help-line)] rounded-[6px] bg-[var(--help-panel)] grid grid-cols-3 gap-x-5 gap-y-[10px] m-0 list-none"
            >
                <li
                    v-for="example in data.examples"
                    :key="example"
                    class="[font-family:var(--help-mono)] text-[14px] before:content-['›'] before:mr-[10px] before:text-[var(--help-accent)]"
                >
                    {{ example }}
                </li>
            </ul>
        </shared-help-section>

        <i18n-t
            keypath="help.details_hint"
            tag="p"
            class="text-[14px] text-center text-[var(--help-text-3)]"
            scope="global"
        >
            <template #command>
                <code
                    class="[font-family:var(--help-mono)] px-[6px] py-[2px] rounded-[3px] text-[var(--help-text-1)] bg-white/[0.08]"
                    >{{ helpCommand }}</code
                >
            </template>
        </i18n-t>

        <help-footer />
    </help-layout>
</template>
