<script lang="ts" setup>
import { HelpData } from '~/types/help';
import HelpView from '~/components/shared/help-view.vue';

const data = useData(HelpData);

useLang();

/** Breadcrumb of length 1 means we're on the root help page. */
const isRoot = computed(() => data.breadcrumb.length === 1);

/**
 * Group root-page shortcuts by their first-level subcommand (target[1]).
 * Shortcuts whose target is the root itself fall into the '__root__' bucket.
 * Returns an ordered list so groups appear in registration / discovery order.
 */
const shortcutGroups = computed(() => {
    const order: string[] = [];
    const buckets = new Map<string, { label: string; items: { key: string; target: string[] }[] }>();
    for (const sc of data.shortcuts) {
        const groupKey = sc.target.length > 1 ? sc.target[1] : '__root__';
        const label = sc.target.length > 1 ? sc.target[1] : data.breadcrumb[0];
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
    <v2-layout content_class="max-w-200">
        <div class="help-page">
            <!-- Breadcrumb -->
            <nav class="breadcrumb">{{ data.breadcrumb.join(' › ') }}</nav>

            <HelpView :node="data.command" :breadcrumb="data.breadcrumb" />

            <!-- Root-only: usage paragraph from CommandMeta.usage -->
            <section v-if="isRoot && data.usage" class="extra-section">
                <div class="section-label">说明</div>
                <p class="prose">{{ data.usage }}</p>
            </section>

            <!-- Root-only: examples (one per line, monospace) -->
            <section v-if="isRoot && data.examples.length > 0" class="extra-section">
                <div class="section-label">示例</div>
                <pre
                    class="code-block"
                ><span v-for="(line, i) in data.examples" :key="line">{{ i === 0 ? '' : '\n' }}{{ line }}</span></pre>
            </section>

            <!-- Shortcuts -->
            <section v-if="data.shortcuts.length > 0" class="extra-section">
                <div class="section-label">快捷指令</div>

                <!-- Root: grouped by first-level subcommand -->
                <template v-if="isRoot">
                    <div v-for="group in shortcutGroups" :key="group.label" class="shortcut-group">
                        <div class="shortcut-group-label">{{ group.label }}</div>
                        <pre
                            class="code-block"
                        ><span v-for="(sc, i) in group.items" :key="sc.key">{{ i === 0 ? '' : '\n' }}{{ sc.key }}</span></pre>
                    </div>
                </template>

                <!-- Subcommand pages: just the keys -->
                <pre
                    v-else
                    class="code-block"
                ><span v-for="(key, i) in flatShortcutKeys" :key="key">{{ i === 0 ? '' : '\n' }}{{ key }}</span></pre>
            </section>
        </div>
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>

<style lang="scss" scoped>
.help-page {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 40px 48px;
    background: #0d1117;
    color: #e6edf3;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.breadcrumb {
    font-size: 13px;
    color: #7d8590;
    font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
}

.extra-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #7d8590;
}

.prose {
    margin: 0;
    font-size: 15px;
    line-height: 1.7;
    color: #b1bac4;
    white-space: pre-line;
}

.code-block {
    margin: 0;
    padding: 14px 18px;
    background: #161b22;
    border-radius: 6px;
    font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
    font-size: 14px;
    line-height: 1.7;
    color: #e6edf3;
    white-space: pre-wrap;
    word-break: break-word;
}

.shortcut-group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    & + & {
        margin-top: 8px;
    }
}

.shortcut-group-label {
    font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
    font-size: 13px;
    color: #8b949e;
}
</style>
