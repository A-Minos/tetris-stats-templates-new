<script lang="ts" setup>
import type { VNode } from 'vue';
import V2TetrioInfo from '~/pages/v2/tetrio/user/info/index.vue';

const { setLocale } = useI18n();

const pages = ref<VNode[]>([]);

onMounted(async () => {
    window.__DATA__ = JSON.stringify({
        user: {
            banner: 'https://tetr.io/user-content/banners/62466f02f071b942778da44b.jpg',
            avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
            name: 'SCDHH',
            id: '5eb270aaeb7d4250d3f2fc47',
            country: 'CN',
            friend_count: 114514,
            supporter_tier: 1,
            role: 'user',
            botmaster: null,
            bad_standing: false,
            bio: '“I am not in danger, Skyler.\nI am the danger. A guy opens his door and gets shot...”',
            badges: [
                {
                    id: 'kod_founder',
                    group: null,
                    description: "KO'd the founder of TETR.IO",
                    receive_at: '2020-12-27T21:34:38.088Z',
                },
            ],
            ar: 1_000,
            achievements: [1, 2, 3, 4, 5, 6, 7, 8],
            xp: 1_000,
            playtime: '1d 2h 3m 4s',
            join_at: '2020-12-27T21:34:38.088Z',
        },
        tetra_league: {
            rank: 'u',
            highest_rank: 'x',
            tr: 24_165.82,
            glicko: 2_429.21,
            rd: 62.29,
            global_rank: 743,
            country_rank: 1_000,
            pps: 2.03,
            apm: 76.87,
            apl: 1.58,
            vs: 170.51,
            adpl: 2.1,
            statistic: {
                total: 1_000,
                wins: 500,
            },
            decaying: false,
            history: [
                { record_at: new Date(1687363200000), score: 24_510.12 },
                { record_at: new Date(1687449600000), score: 24_560.43 },
                { record_at: new Date(1687536000000), score: 24_520.35 },
                { record_at: new Date(1687622400000), score: 24_550.23 },
                { record_at: new Date(1687708800000), score: 25_000.0 },
                { record_at: new Date(1687795200000), score: 24_450.42 },
                { record_at: new Date(1687881600000), score: 24_530.68 },
                { record_at: new Date(1687968000000), score: 24_520.45 },
                { record_at: new Date(1688054400000), score: 24_550.54 },
                { record_at: new Date(1688140800001), score: 22_454.87 },
            ],
        },
        zenith: {
            week: {
                altitude: 1_000,
                global_rank: 1_000,
                country_rank: 1_000,
                play_at: new Date(1688140800000),
            },
            best: {
                altitude: 1_000,
                global_rank: 1_000,
                play_at: new Date(1688140800000),
            },
        },
        zenithex: {
            week: {
                altitude: 1_000,
                global_rank: 1_000,
                country_rank: 1_000,
                play_at: new Date(1688140800000),
            },
            best: {
                altitude: 1_000,
                global_rank: 1_000,
                play_at: new Date(1688140800000),
            },
        },
        statistic: {
            total: 1_000,
            wins: 500,
        },
        sprint: {
            time: '1m 10.2s',
            global_rank: 1_000,
            country_rank: 1_000,
            play_at: new Date(1688140800000),
        },
        blitz: {
            score: 289_085,
            global_rank: 1_000,
            country_rank: 1_000,
            play_at: new Date(1688140800000),
        },
        zen: {
            score: 1_000,
            level: 1_000,
        },
        singleplayer: {
            '40l': '1m 10.2s',
            blitz: '289,085',
        },
    });

    await nextTick();

    const rendered = h(V2TetrioInfo);

    pages.value.push(rendered);

    await nextTick();
});
</script>

<template>
    <div class="flex flex-col p-2 gap-2">
        <button @click="setLocale('zh-CN')" style="z-index: 999999">zh-CN</button>
        <button @click="setLocale('en-US')" style="z-index: 999999">en-US</button>
        <template v-for="page in pages">
            <Component :is="page" />
        </template>
    </div>
</template>
