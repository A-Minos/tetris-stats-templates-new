<script lang="ts" setup>
import { HelpData } from '~/types/help';
import HelpView from '~/components/shared/help-view.vue';

const data = useData(HelpData);

useLang();

/** Breadcrumb of length 1 means we're on the root help page. */
const isRoot = computed(() => data.breadcrumb.length === 1);
</script>

<template>
    <v2-layout content_class="max-w-200">
        <n-card size="small">
            <n-flex vertical :size="20">
                <!-- Breadcrumb -->
                <n-text depth="3" class="text-sm">{{ data.breadcrumb.join(' › ') }}</n-text>

                <HelpView :node="data.command" :breadcrumb="data.breadcrumb" />

                <!-- Root-only: usage paragraph from CommandMeta.usage -->
                <div v-if="isRoot && data.usage">
                    <n-text depth="3" class="text-xs uppercase tracking-wide">说明</n-text>
                    <div class="mt-1 whitespace-pre-line text-base">{{ data.usage }}</div>
                </div>

                <!-- Root-only: examples (one per line, monospace) -->
                <div v-if="isRoot && data.examples.length > 0">
                    <n-text depth="3" class="text-xs uppercase tracking-wide">示例</n-text>
                    <div class="mt-2 flex flex-col gap-1 font-mono text-base">
                        <div v-for="line in data.examples" :key="line">{{ line }}</div>
                    </div>
                </div>

                <!-- Root-only: shortcuts -->
                <div v-if="isRoot && data.shortcuts.length > 0">
                    <n-text depth="3" class="text-xs uppercase tracking-wide">快捷指令</n-text>
                    <div class="mt-2 flex flex-col gap-1 font-mono text-base">
                        <div v-for="line in data.shortcuts" :key="line">{{ line }}</div>
                    </div>
                </div>
            </n-flex>
        </n-card>
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
