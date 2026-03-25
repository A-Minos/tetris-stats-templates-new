<script lang="ts" setup>
import type { Component } from 'vue';
import V2TetrioSprint from '~/pages/v2/tetrio/record/sprint/index.vue';

const pages = ref<Component[]>([]);

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

        time: '00:40.00',

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
        },

        play_at: new Date(),
    });

    await nextTick();

    pages.value.push(h(V2TetrioSprint));

    await nextTick();
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
