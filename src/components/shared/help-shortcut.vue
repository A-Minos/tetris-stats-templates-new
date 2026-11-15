<script lang="ts" setup>
import type { HelpNode } from '~/types/help';
import type { ShortcutView } from '~/utils/help';

const props = defineProps<{
    readonly shortcut: ShortcutView;
    /** The command already described by the surrounding block; its own help text is not repeated. */
    readonly context: HelpNode;
}>();

const notes = computed(() =>
    props.shortcut.bound_options.length || props.shortcut.node !== props.context
        ? props.shortcut.notes.filter(Boolean)
        : [],
);
</script>

<template>
    <div class="flex flex-col gap-1">
        <div class="leading-[1.9]">
            <kbd
                class="px-[7px] py-[1px] rounded-[2px] [font-family:var(--help-mono)] text-[14px] font-700 text-white whitespace-nowrap mr-2 bg-white/[0.08]"
                >{{ shortcut.key }}</kbd
            >
            <shared-help-signature v-if="shortcut.tokens.length > 1" :tokens="shortcut.tokens.slice(1)" />
        </div>
        <span v-for="note in notes" :key="note!" class="text-[13px] text-[var(--help-text-3)]">{{ note }}</span>
    </div>
</template>
