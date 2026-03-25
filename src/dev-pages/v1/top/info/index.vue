<script lang="ts" setup>
import { Trending } from '~/components/v1/trending/index.vue';
import V1TopInfo from '~/pages/v1/top/info/index.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    await addPage({
        user: {
            avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
            name: 'SCDHH',
        },
        today: {
            lpm: 48.72,
            pps: 2.03,
            apm: 76.87,
            apl: 1.58,
            lpm_trending: Trending.UP,
            apm_trending: Trending.DOWN,
        },
        historical: {
            lpm: 48.72,
            pps: 2.03,
            apm: 76.87,
            apl: 1.58,
            lpm_trending: Trending.UP,
            apm_trending: Trending.DOWN,
        },
    }, V1TopInfo);
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
