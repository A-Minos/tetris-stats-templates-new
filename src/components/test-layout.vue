<script lang="ts" setup>
import type { VNode } from 'vue';
import { nextTick, onMounted, onUpdated, ref } from 'vue';

const props = defineProps<{
    readonly pages: readonly VNode[];
}>();

const { setLocale } = useI18n();
const rootRef = ref<HTMLElement | null>(null);

function inferPreviewWidth(content: HTMLElement) {
    for (const token of content.className.split(/\s+/)) {
        const numericMatch = token.match(/^max-w-(\d+(?:\.\d+)?)$/);
        if (numericMatch) return `${Number(numericMatch[1]) / 4}rem`;

        const arbitraryMatch = token.match(/^max-w-\[(.+)\]$/);
        if (arbitraryMatch) return arbitraryMatch[1];
    }

    return null;
}

async function syncPreviewWidths() {
    await nextTick();

    for (const frame of rootRef.value?.querySelectorAll<HTMLElement>('[data-preview-frame]') ?? []) {
        const inner = frame.querySelector<HTMLElement>('[data-preview-inner]');
        const content = frame.querySelector<HTMLElement>('#content');
        if (!inner) continue;

        const width = content ? inferPreviewWidth(content) : null;
        inner.style.width = width ?? '100%';
        inner.style.minWidth = width ?? '100%';
    }
}

onMounted(() => {
    void syncPreviewWidths();
});

onUpdated(() => {
    void syncPreviewWidths();
});
</script>

<template>
    <div ref="rootRef" class="min-h-screen isolate bg-[#2b2b36] p-12">
        <div class="flex flex-col gap-12">
            <div
                v-for="(page, index) in props.pages"
                :key="index"
                data-preview-frame
                class="relative w-fit max-w-full self-start overflow-x-auto rounded border-2 border-dashed border-white/30 p-0"
            >
                <div data-preview-inner class="inline-block min-w-full align-top">
                    <Component :is="page" class="relative block h-max min-w-full !static" />
                </div>
            </div>
        </div>

        <div class="fixed bottom-4 right-4 z-9999 flex gap-2">
            <button
                v-for="locale in ['zh-CN', 'en-US'] as const"
                :key="locale"
                class="cursor-pointer rounded-2 border-none bg-black/60 px-3 py-1.5 text-sm text-white/80 shadow backdrop-blur-sm hover:bg-black/80"
                @click="setLocale(locale)"
            >
                {{ locale }}
            </button>
        </div>
    </div>
</template>
