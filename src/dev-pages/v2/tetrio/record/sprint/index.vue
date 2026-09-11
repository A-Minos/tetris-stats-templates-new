<script lang="ts" setup>
import V2TetrioSprint from '~/pages/v2/tetrio/record/sprint/index.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    const record = {
        user: {
            avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
            name: 'scdhh',
            id: '5eb270aaeb7d4250d3f2fc47',
            country: 'CN',
        },

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
        country_rank: null,
    };
    for (const context of [
        {
            query: { type: 'top', index: 1 },
            global_rank: 123,
            country_rank: 8,
            personal_best: 'current',
            disputed: false,
        },
        { query: { type: 'top', index: 3 }, global_rank: null, personal_best: null, disputed: false },
        { query: { type: 'recent', index: 3 }, global_rank: null, personal_best: null, disputed: false },
        { query: { type: 'recent', index: 2 }, global_rank: 123, personal_best: 'current', disputed: false },
        { query: { type: 'recent', index: 4 }, global_rank: null, personal_best: 'former', disputed: false },
        { query: { type: 'progression', index: 3 }, global_rank: null, personal_best: 'former', disputed: false },
        { query: { type: 'progression', index: 4 }, global_rank: null, personal_best: 'former', disputed: true },
        { query: { type: 'progression', index: 1 }, global_rank: null, personal_best: 'current', disputed: true },
        {
            query: { type: 'top', index: 1 },
            global_rank: null,
            country_rank: 8,
            personal_best: 'current',
            disputed: false,
        },
        {
            query: { type: 'top', index: 1 },
            global_rank: 123,
            personal_best: 'current',
            disputed: false,
            user: { ...record.user, country: null },
        },
    ]) {
        await addPage({ ...record, ...context }, V2TetrioSprint);
    }
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
