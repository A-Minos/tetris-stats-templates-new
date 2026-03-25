<script lang="ts" setup>
import { Trending } from '~/components/v1/trending/index.vue';
import V1TetrioInfo from '~/pages/v1/tetrio/info/index.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    await addPage({
        user: {
            avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
            name: 'SCDHH',
            bio: '“I am not in danger, Skyler.\nI am the danger. A guy opens his door and gets shot...”',
        },
        multiplayer: {
            tr: '24,165.82',
            glicko: '2,429.21',
            rd: 62.29,
            rank: 'u',
            global_rank: 1000,
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
            dsps: 0.42,
            ge: 0.26,
            lpm_trending: Trending.UP,
            apm_trending: Trending.DOWN,
            adpm_trending: Trending.KEEP,

            history: {
                data: [
                    { record_at: new Date(1687363200000), score: 24510.12 },
                    { record_at: new Date(1687449600000), score: 24560.43 },
                    { record_at: new Date(1687536000000), score: 24520.35 },
                    { record_at: new Date(1687622400000), score: 24550.23 },
                    { record_at: new Date(1687708800000), score: 25000.0 },
                    { record_at: new Date(1687795200000), score: 24450.42 },
                    { record_at: new Date(1687881600000), score: 24530.68 },
                    { record_at: new Date(1687968000000), score: 24520.45 },
                    { record_at: new Date(1688054400000), score: 24550.54 },
                    { record_at: new Date(1688140800001), score: 22454.87 },
                ],
                split_interval: 5000,
                min_value: 5000,
                max_value: 25000,
                offset: 0,
            },
        },
        singleplayer: {
            sprint: '1m 10.2s',
            blitz: '289,085',
        },
    }, V1TetrioInfo);
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
