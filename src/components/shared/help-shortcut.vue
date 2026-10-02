<script lang="ts" setup>
import type { UsageToken } from '~/utils/help';
import HelpSignature from '~/components/shared/help-signature.vue';

defineProps<{
    readonly tokens: UsageToken[];
    readonly descriptions?: Array<string | null>;
}>();
</script>

<template>
    <div class="inline-flex flex-col gap-1 rounded-lg border border-white/12 bg-white/4 px-3 py-2 max-w-full">
        <HelpSignature :tokens="tokens" class="text-sm" />
        <template v-for="(description, index) in descriptions" :key="index">
            <n-text v-if="description" :depth="3" class="text-xs leading-5">{{ description }}</n-text>
        </template>
    </div>
</template>
