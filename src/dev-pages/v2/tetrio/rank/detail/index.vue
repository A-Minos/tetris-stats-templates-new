<script lang="ts" setup>
import type { Component } from 'vue';
import V2TetrioDetailRank from '~/pages/v2/tetrio/rank/detail/index.vue';

const pages = ref<Component[]>([]);

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

    pages.value.push(h(V2TetrioDetailRank));

    await nextTick();
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
