<script lang="ts" setup>
import { HelpData } from '~/types/help';
import { createUsageTokens, resolveShortcutTarget } from '~/utils/help';
import { helpGames } from '~/constants/help-games';
import HelpHeader from '~/components/shared/help-header.vue';
import HelpView from '~/components/shared/help-view.vue';
import HelpShortcut from '~/components/shared/help-shortcut.vue';
import Tetromino, { tetrominoColors } from '~/components/shared/tetromino.vue';

const data = useData(HelpData);
const { t } = useI18n();
useLang();

const isRoot = data.breadcrumb.length === 1;
const gameAppearance = helpGames[data.breadcrumb[1]!];
const accent = gameAppearance && tetrominoColors[gameAppearance.shape];
const shortcuts = data.shortcuts.map((shortcut) => {
    const node = resolveShortcutTarget(data.command, data.breadcrumb, shortcut.target);
    return {
        ...shortcut,
        node,
        tokens: createUsageTokens(node, [shortcut.key], shortcut.bound_options),
    };
});
const games = data.command.subcommands.map((game) => ({
    ...game,
    appearance: helpGames[game.name],
    commands: game.subcommands.map((command) => ({
        ...command,
        shortcuts: shortcuts.filter(
            (shortcut) => shortcut.target[1] === game.name && shortcut.target[2] === command.name,
        ),
    })),
}));
const helpCommand = computed(() =>
    [data.breadcrumb.join(' '), ...(data.command.subcommands.length ? [`<${t('help.subcommand')}>`] : [])].join(' '),
);
</script>

<template>
    <v2-layout content_class="max-w-320 help-page">
        <HelpHeader :command="data.command" :breadcrumb="data.breadcrumb" />

        <template v-if="isRoot">
            <n-divider v-if="data.usage" class="!my-0">{{ $t('help.description') }}</n-divider>
            <n-card v-if="data.usage" size="small">
                <n-text :depth="2" class="whitespace-pre-line leading-7">{{ data.usage }}</n-text>
            </n-card>

            <n-card
                v-for="game in games"
                :key="game.dest"
                size="small"
                :style="{ borderLeft: game.appearance && `3px solid ${tetrominoColors[game.appearance.shape]}` }"
            >
                <template #header>
                    <n-flex align="center" size="small">
                        <Tetromino v-if="game.appearance" :shape="game.appearance.shape" :size="9" />
                        <n-text
                            class="text-6 fw-bold help-title"
                            :style="{ color: game.appearance && tetrominoColors[game.appearance.shape] }"
                        >
                            {{ game.name }}
                        </n-text>
                        <n-text v-if="game.aliases.length" :depth="3" class="text-xs">
                            {{ game.aliases.join(' / ') }}
                        </n-text>
                    </n-flex>
                </template>
                <n-text v-if="game.help_text" :depth="2" class="block mb-3">{{ game.help_text }}</n-text>
                <div
                    v-for="command in game.commands"
                    :key="command.dest"
                    class="grid grid-cols-[minmax(120px,1fr)_5fr] gap-x-5 py-3 border-t border-white/8"
                >
                    <div>
                        <span
                            class="inline-block size-2.5 mr-2 rounded-sm"
                            :style="{ background: game.appearance && tetrominoColors[game.appearance.shape] }"
                        />
                        <n-text class="help-command fw-bold">{{ command.name }}</n-text>
                        <n-text v-if="command.aliases.length" :depth="3" class="block text-xs mt-1">
                            {{ command.aliases.join(' / ') }}
                        </n-text>
                    </div>
                    <n-flex vertical size="small">
                        <n-text :depth="2">{{ command.help_text }}</n-text>
                        <n-flex v-if="command.shortcuts.length" size="small">
                            <HelpShortcut
                                v-for="shortcut in command.shortcuts"
                                :key="shortcut.key"
                                :tokens="shortcut.tokens"
                                :description="shortcut.node.name !== command.name ? shortcut.node.help_text : undefined"
                            />
                        </n-flex>
                    </n-flex>
                </div>
            </n-card>

            <n-divider v-if="data.examples.length" class="!my-0">{{ $t('help.examples') }}</n-divider>
            <n-card v-if="data.examples.length" size="small">
                <n-flex vertical size="small">
                    <n-code v-for="example in data.examples" :key="example" :code="example" word-wrap />
                </n-flex>
            </n-card>
        </template>

        <template v-else>
            <n-text class="text-xs help-command" :depth="3">{{ data.breadcrumb.join(' › ') }}</n-text>
            <HelpView :command="data.command" :breadcrumb="data.breadcrumb" :accent="accent" />
            <n-divider v-if="shortcuts.length" class="!my-0">{{ $t('help.shortcuts') }}</n-divider>
            <n-card v-if="shortcuts.length" size="small">
                <n-flex size="small">
                    <HelpShortcut
                        v-for="shortcut in shortcuts"
                        :key="shortcut.key"
                        :tokens="shortcut.tokens"
                        :description="shortcut.node.help_text"
                    />
                </n-flex>
            </n-card>
        </template>

        <i18n-t keypath="help.details_hint" tag="div" class="text-sm text-center leading-7" scope="global">
            <template #command>
                <n-code :code="helpCommand" inline />
            </template>
        </i18n-t>
        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';

.help-page .help-title {
    font-family: 'HUN', 'HarmonyOS Sans SC', sans-serif;
}

.help-page .help-command,
.help-page code,
.help-page .n-code {
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', 'Courier New', 'HarmonyOS Sans SC', monospace;
}
</style>
