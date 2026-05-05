<script lang="ts" setup>
import { HelpData } from '~/types/help';
import HelpView from '~/components/shared/help-view.vue';

const data = useData(HelpData);

useLang();

/** Breadcrumb of length 1 means we're on the root help page. */
const isRoot = computed(() => data.breadcrumb.length === 1);

/**
 * Alconna 的 header_display 形如 "tetris-stats|tstats"。多别名通过 `|`
 * 拼成一个 token，在面包屑里展开会重复显示。这里只保留主名（第一个）。
 */
const cleanBreadcrumb = computed(() => data.breadcrumb.map((seg) => seg.split('|')[0]!));

/**
 * Group root-page shortcuts by their first-level subcommand (target[1]).
 * Shortcuts whose target is the root itself fall into the '__root__' bucket.
 * Returns an ordered list so groups appear in registration / discovery order.
 */
const shortcutGroups = computed(() => {
    const order: string[] = [];
    const buckets = new Map<string, { label: string; items: { key: string; target: string[] }[] }>();
    for (const sc of data.shortcuts) {
        const groupKey = sc.target.length > 1 ? sc.target[1]!.split('|')[0]! : '__root__';
        const label = sc.target.length > 1 ? groupKey : cleanBreadcrumb.value[0]!;
        if (!buckets.has(groupKey)) {
            buckets.set(groupKey, { label, items: [] });
            order.push(groupKey);
        }
        buckets.get(groupKey)!.items.push(sc);
    }
    return order.map((k) => buckets.get(k)!);
});

/** On a non-root page we just need the keys. */
const flatShortcutKeys = computed(() => data.shortcuts.map((sc) => sc.key));
</script>

<template>
    <v2-layout content_class="max-w-200 !p-10">
        <n-flex vertical :size="28">
            <!-- Breadcrumb (only on non-root pages; root page's title already shows the name) -->
            <n-text v-if="!isRoot" class="font-mono text-3.5" :depth="3">{{ cleanBreadcrumb.join(' › ') }}</n-text>

            <HelpView :node="data.command" :breadcrumb="cleanBreadcrumb" />

            <!-- Root-only: usage paragraph from CommandMeta.usage -->
            <n-card v-if="isRoot && data.usage" size="small">
                <template #header>
                    <n-text class="text-2.75 fw-600 tracking-[0.12em] uppercase" :depth="3">说明</n-text>
                </template>
                <n-text class="text-3.75 leading-7 whitespace-pre-line">{{ data.usage }}</n-text>
            </n-card>

            <!-- Root-only: examples (one per line, monospace) -->
            <n-card v-if="isRoot && data.examples.length > 0" size="small">
                <template #header>
                    <n-text class="text-2.75 fw-600 tracking-[0.12em] uppercase" :depth="3">示例</n-text>
                </template>
                <pre class="m-0 font-mono text-3.5 leading-7 whitespace-pre-wrap break-words">{{
                    data.examples.join('\n')
                }}</pre>
            </n-card>

            <!-- Shortcuts -->
            <n-card v-if="data.shortcuts.length > 0" size="small">
                <template #header>
                    <n-text class="text-2.75 fw-600 tracking-[0.12em] uppercase" :depth="3">快捷指令</n-text>
                </template>

                <!-- Root: grouped by first-level subcommand -->
                <n-flex v-if="isRoot" vertical :size="14">
                    <n-flex v-for="group in shortcutGroups" :key="group.label" vertical :size="6">
                        <n-text v-if="group.label !== cleanBreadcrumb[0]" class="font-mono text-3.25" :depth="2">
                            {{ group.label }}
                        </n-text>
                        <pre class="m-0 font-mono text-3.5 leading-7 whitespace-pre-wrap break-words">{{
                            group.items.map((sc) => sc.key).join('\n')
                        }}</pre>
                    </n-flex>
                </n-flex>

                <!-- Subcommand pages: just the keys -->
                <pre v-else class="m-0 font-mono text-3.5 leading-7 whitespace-pre-wrap break-words">{{
                    flatShortcutKeys.join('\n')
                }}</pre>
            </n-card>
        </n-flex>
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
