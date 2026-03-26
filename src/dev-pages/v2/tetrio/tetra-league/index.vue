<script lang="ts" setup>
import { useDevPage } from '~/dev-pages/useDevPage';
import V2TetrioTetraLeague from '~/pages/v2/tetrio/tetra-league/index.vue';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    await addPage(
        {
            matches: [
                {
                    sequence: 1,
                    replay_id: '67a1b2c3d4e5f6',
                    played_at: '2025-03-20T12:00:00Z',
                    user: {
                        id: '5eb270aaeb7d4250d3f2fc47',
                        name: 'SCDHH',
                        avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
                        country: 'cn',
                        stats: { pps: 2.45, apm: 85.5, vs: 180.3 },
                    },
                    opponent: {
                        id: '5eb270aaeb7d4250d3f2fc48',
                        name: 'ICLY',
                        avatar: { type: 'identicon', hash: '5eb270aaeb7d4250d3f2fc48' },
                        country: 'us',
                        stats: { pps: 1.92, apm: 68.3, vs: 152.1 },
                    },
                    is_winner: true,
                    score: { user: 7, opponent: 3 },
                },
                {
                    sequence: 2,
                    replay_id: '77b2c3d4e5f6g7',
                    played_at: '2025-03-19T15:30:00Z',
                    user: {
                        id: '5eb270aaeb7d4250d3f2fc47',
                        name: 'SCDHH',
                        avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
                        country: 'cn',
                        stats: { pps: 1.98, apm: 72.1, vs: 155.6 },
                    },
                    opponent: {
                        id: '6ec381bbfc8e5361e4g3gd59',
                        name: 'osk',
                        avatar: 'https://tetr.io/user-content/avatars/6ec381bbfc8e5361e4g3gd59.jpg?rv=1',
                        country: 'jp',
                        stats: { pps: 2.63, apm: 95.8, vs: 201.4 },
                    },
                    is_winner: false,
                    score: { user: 4, opponent: 7 },
                },
                {
                    sequence: 3,
                    replay_id: '87c3d4e5f6g7h8',
                    played_at: '2025-03-18T09:15:00Z',
                    user: {
                        id: '5eb270aaeb7d4250d3f2fc47',
                        name: 'SCDHH',
                        avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
                        country: 'cn',
                        stats: { pps: 2.78, apm: 91.2, vs: 195.8 },
                    },
                    opponent: {
                        id: '7fd492ccgd9f6472f5h4he6a',
                        name: 'caboozled_pie',
                        avatar: { type: 'identicon', hash: '7fd492ccgd9f6472f5h4he6a' },
                        country: null,
                        stats: { pps: 2.55, apm: 88.7, vs: 190.2 },
                    },
                    is_winner: true,
                    score: { user: 7, opponent: 5 },
                },
            ],
        },
        V2TetrioTetraLeague,
    );
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
