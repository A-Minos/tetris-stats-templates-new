<script lang="ts" setup>
import type { HelpNode } from '~/types/help';
import type { ShortcutView } from '~/utils/help';
import HelpSignature from '~/components/shared/help-signature.vue';

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
    <div class="help-shortcut">
        <div class="help-shortcut-line">
            <kbd class="help-key">{{ shortcut.key }}</kbd>
            <HelpSignature v-if="shortcut.tokens.length > 1" :tokens="shortcut.tokens.slice(1)" />
        </div>
        <span v-for="note in notes" :key="note!" class="help-shortcut-note">{{ note }}</span>
    </div>
</template>
