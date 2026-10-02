<script lang="ts" setup>
import { HelpData } from '~/types/help';
import { describeShortcuts } from '~/utils/help';
import HelpCommandGrid from '~/components/shared/help-command-grid.vue';
import HelpSection from '~/components/shared/help-section.vue';
import HelpShortcut from '~/components/shared/help-shortcut.vue';
import HelpView from '~/components/shared/help-view.vue';

const data = useData(HelpData);
const { t } = useI18n();
useLang();

const isRoot = data.breadcrumb.length === 1;
const shortcuts = describeShortcuts(data);
// Shortcuts for deeper commands are listed on their command tiles.
const ownShortcuts = data.command.subcommands.length
    ? shortcuts.filter((shortcut) => shortcut.node === data.command)
    : shortcuts;
const helpCommand = [
    data.breadcrumb.join(' '),
    ...(data.command.subcommands.length ? [`<${t('help.subcommand')}>`] : []),
].join(' ');
// Games with only a few commands share a row instead of leaving most of a full-width row empty.
const isWideGame = (commandCount: number) => commandCount > 4;
</script>

<template>
    <main id="content" class="help max-w-320">
        <header class="help-header">
            <code v-if="!isRoot" class="help-breadcrumb">{{ data.breadcrumb.join(' / ') }}</code>
            <h1 class="help-title">
                {{ data.command.name }}
                <span v-if="data.command.aliases.length" class="help-aliases">
                    {{ data.command.aliases.join(' / ') }}
                </span>
            </h1>
            <p v-if="data.command.help_text" class="help-description">{{ data.command.help_text }}</p>
            <p v-if="data.usage" class="help-usage-text">{{ data.usage }}</p>
        </header>

        <div v-if="isRoot" class="help-games">
            <section
                v-for="game in data.command.subcommands"
                :key="game.dest"
                class="help-section"
                :class="{ 'help-game--wide': isWideGame(game.subcommands.length) }"
            >
                <div class="help-game-head">
                    <h2 class="help-game-name">{{ game.name }}</h2>
                    <code v-if="game.aliases.length" class="help-aliases">{{ game.aliases.join(' / ') }}</code>
                    <span v-if="game.help_text" class="help-game-description">{{ game.help_text }}</span>
                </div>
                <HelpCommandGrid
                    :commands="game.subcommands"
                    :path="[...data.breadcrumb, game.name]"
                    :shortcuts="shortcuts"
                    :columns="isWideGame(game.subcommands.length) ? 3 : 2"
                />
            </section>
        </div>

        <template v-else>
            <HelpView :command="data.command" :breadcrumb="data.breadcrumb" />
            <HelpSection v-if="data.command.subcommands.length" :title="$t('help.subcommands')">
                <HelpCommandGrid
                    :commands="data.command.subcommands"
                    :path="data.breadcrumb"
                    :shortcuts="shortcuts"
                    :columns="3"
                />
            </HelpSection>
            <HelpSection v-if="ownShortcuts.length" :title="$t('help.shortcuts')">
                <div class="help-panel help-shortcuts">
                    <HelpShortcut
                        v-for="shortcut in ownShortcuts"
                        :key="shortcut.key"
                        :shortcut="shortcut"
                        :context="data.command"
                    />
                </div>
            </HelpSection>
        </template>

        <HelpSection v-if="data.examples.length" :title="$t('help.examples')">
            <ul class="help-panel help-examples">
                <li v-for="example in data.examples" :key="example" class="help-example">{{ example }}</li>
            </ul>
        </HelpSection>

        <i18n-t keypath="help.details_hint" tag="p" class="help-hint" scope="global">
            <template #command>
                <code>{{ helpCommand }}</code>
            </template>
        </i18n-t>

        <footer class="help-footer">
            <i18n-t keypath="v2.footer.powered_by" tag="span" scope="global">
                <template #product>
                    <span class="help-footer-product">NoneBot2 x nonebot-plugin-tetris-stats</span>
                </template>
            </i18n-t>
        </footer>
    </main>
</template>

<style lang="scss">
@use '~/styles/help';
</style>
