<script lang="ts" setup>
import type { HelpCommand, HelpShortcut } from '~/types/help';
import { createUsageTokens } from '~/utils/help';

const props = defineProps<{
    /** Commands to list, all children of the node at `path`. */
    readonly commands: HelpCommand[];
    readonly path: string[];
    readonly columns: number;
}>();

const { t } = useI18n();
const collectShortcuts = (command: HelpCommand): HelpShortcut[] => [
    ...command.shortcuts,
    ...command.subcommands.flatMap(collectShortcuts),
];
const tiles = computed(() =>
    props.commands.map((command) => {
        const prefix = [...props.path, command.name];
        const signature = createUsageTokens(command, prefix);
        if (command.subcommands.length) signature.push({ text: `<${t('help.subcommand')}>`, kind: 'required' });
        return {
            command,
            signature,
            shortcuts: collectShortcuts(command),
        };
    }),
);
</script>

<template>
    <div class="[columns:var(--help-columns)] gap-x-[10px]" :style="{ '--help-columns': columns }">
        <article
            v-for="{ command, signature, shortcuts: own } in tiles"
            :key="command.name"
            class="flex flex-col gap-[10px] px-4 py-[14px] border-1 border-solid border-[var(--help-line)] rounded-[6px] bg-[var(--help-panel)] break-inside-avoid mb-[10px]"
        >
            <span class="text-[16px] text-[var(--help-text-1)]">{{ command.description }}</span>
            <shared-help-signature :tokens="signature" />
            <div
                v-if="own.length"
                class="flex flex-col gap-2 pt-[10px] border-t-1 border-t-solid border-[var(--help-line)]"
            >
                <shared-help-shortcut
                    v-for="shortcut in own"
                    :key="shortcut.label"
                    :shortcut="shortcut"
                    :context="command"
                />
            </div>
        </article>
    </div>
</template>
