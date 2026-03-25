<script lang="ts" setup>
import V2TetrioDetailRank from '~/pages/v2/tetrio/rank/detail/index.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    await addPage({
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
    }, V2TetrioDetailRank);
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
