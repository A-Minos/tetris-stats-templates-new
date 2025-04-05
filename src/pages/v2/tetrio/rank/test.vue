<script lang="ts" setup>
import type { VNode } from 'vue';
import V2TetrioRank from '~/pages/v2/tetrio/rank/index.vue';

const { setLocale } = useI18n();

const pages = ref<VNode[]>([]);

onMounted(async () => {
    window.__DATA__ = JSON.stringify({
        items: {
            u: {
                require_tr: 1145,
                trending: 123,
                average_data: {
                    pps: 1.0,
                    apm: 1.0,
                    apl: 1.0,
                    vs: 1.0,
                    adpl: 1.0,
                },
                players: 1_000,
            },
        },
        updated_at: new Date(),
    });

    await nextTick();

    const rendered = h(V2TetrioRank);

    pages.value.push(rendered);

    await nextTick();
});
</script>

<template>
    <div class="flex flex-col p-2 gap-2">
        <button @click="setLocale('zh-CN')">zh-CN</button>
        <button @click="setLocale('en-US')">en-US</button>
        <template v-for="page in pages">
            <Component :is="page" />
        </template>
    </div>
</template>
