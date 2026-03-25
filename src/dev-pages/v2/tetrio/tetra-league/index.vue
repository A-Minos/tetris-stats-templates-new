<script lang="ts" setup>
import V2TetrioTetraLeague from '~/pages/v2/tetrio/tetra-league/index.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    await addPage(
        {
            replay_id: 'test_replay',
            games: [
                {
                    user: {
                        id: 'user1',
                        name: 'a',
                    },
                    points: 10,
                    average_data: {
                        pps: 2.5,
                        apm: 80.5,
                        apl: 1.6,
                        vs: 180.0,
                        adpl: 2.2,
                    },
                    data: [
                        {
                            pps: 2.4,
                            apm: 78.0,
                            apl: 1.5,
                            vs: 175.0,
                            adpl: 2.1,
                        },
                        {
                            pps: 2.6,
                            apm: 83.0,
                            apl: 1.7,
                            vs: 185.0,
                            adpl: 2.3,
                        },
                    ],
                },
                {
                    user: {
                        id: 'user2',
                        name: 'b',
                    },
                    points: 50,
                    average_data: {
                        pps: 3.0,
                        apm: 90.0,
                        apl: 1.8,
                        vs: 200.0,
                        adpl: 2.5,
                    },
                    data: [
                        {
                            pps: 2.9,
                            apm: 88.0,
                            apl: 1.7,
                            vs: 195.0,
                            adpl: 2.4,
                        },
                        {
                            pps: 3.1,
                            apm: 92.0,
                            apl: 1.9,
                            vs: 205.0,
                            adpl: 2.6,
                        },
                    ],
                },
                {
                    user: {
                        id: 'user3',
                        name: 'c',
                    },
                    points: 100,
                    average_data: {
                        pps: 3.5,
                        apm: 100.0,
                        apl: 2.0,
                        vs: 220.0,
                        adpl: 2.8,
                    },
                    data: [
                        {
                            pps: 3.4,
                            apm: 98.0,
                            apl: 1.9,
                            vs: 215.0,
                            adpl: 2.7,
                        },
                        {
                            pps: 3.6,
                            apm: 102.0,
                            apl: 2.1,
                            vs: 225.0,
                            adpl: 2.9,
                        },
                    ],
                },
            ],
            play_at: new Date(),
        },
        V2TetrioTetraLeague,
    );
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
