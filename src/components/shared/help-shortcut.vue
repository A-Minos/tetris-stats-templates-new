<script lang="ts" setup>
import type { HelpCommand, HelpShortcut } from '~/types/help';
import { createUsageTokens } from '~/utils/help';

const props = defineProps<{
    readonly shortcut: HelpShortcut;
    /** The command already described by the surrounding block; its own help text is not repeated. */
    readonly context: HelpCommand;
}>();

const tokens = computed(() => createUsageTokens(props.shortcut, []));
const notes = computed(() => props.shortcut.notes.filter((note) => note !== props.context.description));
</script>

<template>
    <div class="flex flex-col gap-1">
        <div class="leading-[1.9]">
            <kbd
                class="px-[7px] py-[1px] rounded-[2px] [font-family:var(--help-mono)] text-[14px] font-700 text-white whitespace-nowrap mr-2 bg-white/[0.08]"
                >{{ shortcut.label }}</kbd
            >
            <shared-help-signature v-if="tokens.length" :tokens="tokens" />
        </div>
        <span v-for="note in notes" :key="note" class="text-[13px] text-[var(--help-text-3)]">{{ note }}</span>
    </div>
</template>
