<script lang="ts" setup>
import type { HelpNode } from '~/types/help';
import { createUsageTokens, type ShortcutView } from '~/utils/help';
import HelpShortcut from '~/components/shared/help-shortcut.vue';
import HelpSignature from '~/components/shared/help-signature.vue';

const props = defineProps<{
    /** Commands to list, all children of the node at `path`. */
    readonly commands: HelpNode[];
    readonly path: string[];
    readonly shortcuts: ShortcutView[];
    readonly columns: number;
}>();

const { t } = useI18n();
const tiles = computed(() =>
    props.commands.map((command) => {
        const prefix = [...props.path, command.name];
        const signature = createUsageTokens(command, prefix);
        if (command.subcommands.length) signature.push({ text: `<${t('help.subcommand')}>`, kind: 'required' });
        return {
            command,
            signature,
            shortcuts: props.shortcuts.filter((shortcut) =>
                prefix.every((name, index) => shortcut.target[index] === name),
            ),
        };
    }),
);
</script>

<template>
    <div class="help-grid" :style="{ '--help-columns': columns }">
        <article v-for="{ command, signature, shortcuts: own } in tiles" :key="command.dest" class="help-tile">
            <span class="help-tile-title">{{ command.help_text }}</span>
            <HelpSignature :tokens="signature" />
            <div v-if="own.length" class="help-shortcuts">
                <HelpShortcut v-for="shortcut in own" :key="shortcut.key" :shortcut="shortcut" :context="command" />
            </div>
        </article>
    </div>
</template>
