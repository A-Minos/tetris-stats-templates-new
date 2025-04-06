<script lang="ts" setup>
import type { VNode } from 'vue';
import V2TetrioDetailRank from '~/pages/v2/tetrio/rank/detail/index.vue';

const { setLocale } = useI18n();

const pages = ref<VNode[]>([]);

onMounted(async () => {
    window.__DATA__ = JSON.stringify({
        name: 'x+',
        trending: 123,
        require_tr: 114514,
        players: 1000,

        minimum_data: {
            pps: 2,
            lpm: 48,
            apm: 96,
            apl: 2,
            vs: 5,
            adpm: 114,
            adpl: 7,
            pps_holder: 'ICLY',
            apm_holder: 'ICLY',
            vs_holder: 'ICLY',
        },
        average_data: {
            pps: 2,
            lpm: 48,
            apm: 96,
            apl: 2,
            vs: 5,
            adpm: 114,
            adpl: 7,
            pps_holder: 'ICLY',
            apm_holder: 'ICLY',
            vs_holder: 'ICLY',
        },
        maximum_data: {
            pps: 2,
            lpm: 48,
            apm: 96,
            apl: 2,
            vs: 5,
            adpm: 114,
            adpl: 7,
            pps_holder: 'ICLY',
            apm_holder: 'ICLY',
            vs_holder: 'ICLY',
        },
        updated_at: new Date(),
    });

    await nextTick();

    const rendered = h(V2TetrioDetailRank);

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
