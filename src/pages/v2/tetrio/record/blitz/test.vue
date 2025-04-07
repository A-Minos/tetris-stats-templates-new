<script lang="ts" setup>
import type { VNode } from 'vue';
import V2TetrioBlitz from '~/pages/v2/tetrio/record/blitz/index.vue';

const { setLocale } = useI18n();

const pages = ref<VNode[]>([]);

onMounted(async () => {
    window.__DATA__ = JSON.stringify({
        type: 'best',

        user: {
            avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
            name: 'scdhh',
            id: '5eb270aaeb7d4250d3f2fc47',
        },
        rank: 1,
        personal_rank: 1,

        replay_id: '5eb270aaeb7d4250d3f2fc47',
        statistic: {
            keys: 100,
            kpp: 1.0,
            kps: 1.0,

            max: {
                combo: 100,
                btb: 100,
            },

            pieces: 60,
            pps: 1.5,
            lines: 40,
            lpm: 2.5,
            holds: 0,
            score: 1000000,

            single: 0,
            double: 0,
            triple: 0,
            quad: 0,

            tspins: {
                total: 0,
                single: 0,
                double: 0,
                triple: 0,

                mini: {
                    total: 0,
                    single: 0,
                    double: 0,
                },
            },
            all_clear: 0,
            finesse: {
                faults: 10,
                accuracy: 5,
            },
            spp: 1234,
            level: 1,
        },

        play_at: new Date(),
    });

    await nextTick();

    const rendered = h(V2TetrioBlitz);

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
