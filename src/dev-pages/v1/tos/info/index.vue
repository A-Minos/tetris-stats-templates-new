<script lang="ts" setup>
import { Trending } from '~/components/v1/trending/index.vue';
import V1TosInfo from '~/pages/v1/tos/info/index.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    await addPage({
        user: {
            avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
            name: 'SCDHH',
        },
        multiplayer: {
            lpm: 48.72,
            pps: 2.03,
            apm: 76.87,
            apl: 1.58,
            adpm: 102.31,
            vs: 170.51,
            adpl: 2.1,
            app: 0.63,
            ci: 37.15,
            dspp: 0.2,
            or: 0.42,
            ge: 0.26,
            lpm_trending: Trending.UP,
            apm_trending: Trending.DOWN,
            adpm_trending: Trending.KEEP,

            history: {
                data: [
                    { record_at: new Date(1687363200000), score: 1500 },
                    { record_at: new Date(1687449600000), score: 2000 },
                    { record_at: new Date(1687536000000), score: 2500 },
                    { record_at: new Date(1687622400000), score: 3000 },
                    { record_at: new Date(1687708800000), score: 1000 },
                    { record_at: new Date(1687795200000), score: 1200 },
                    { record_at: new Date(1687881600000), score: 1800 },
                    { record_at: new Date(1687968000000), score: 2200 },
                    { record_at: new Date(1688054400000), score: 2700 },
                    { record_at: new Date(1688140800001), score: 3000 },
                ],
                split_interval: 5000,
                min_value: 1000,
                max_value: 3500,
                offset: 0,
            },
            rating: 1234.56,
            rd: 123.45,
        },
        singleplayer: {
            sprint: '1m 10.2s',
            challenge: '289,085',
            marathon: '289,085',
        },
    }, V1TosInfo);
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
