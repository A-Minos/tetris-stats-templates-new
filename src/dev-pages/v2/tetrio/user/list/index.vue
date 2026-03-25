<script lang="ts" setup>
import V2TetrioList from '~/pages/v2/tetrio/user/list/index.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    await addPage(
        {
            show_index: true,
            data: [
                {
                    user: {
                        id: '5eb270aaeb7d4250d3f2fc47',
                        name: 'SCDHH',
                        avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
                        country: 'CN',
                        xp: 1_000,
                    },
                    tetra_league: {
                        pps: 2.03,
                        apm: 76.87,
                        apl: 1.58,
                        vs: 170.51,
                        adpl: 2.1,
                        rank: 'u',
                        tr: 24_165.82,
                        glicko: 2_429.21,
                        rd: 62.29,
                        decaying: false,
                    },
                },
            ],
        },
        V2TetrioList,
    );
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
