<script lang="ts" setup>
import type { VNode } from 'vue';
import V2TetrioTetraLeague from '~/pages/v2/tetrio/tetra-league/index.vue';

const { setLocale } = useI18n();

const pages = ref<VNode[]>([]);

onMounted(async () => {
    window.__DATA__ = JSON.stringify({
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
                handling: {
                    arr: 1,
                    das: 2,
                    sdf: 3,
                },
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
                handling: {
                    arr: 2,
                    das: 3,
                    sdf: 4,
                },
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
                handling: {
                    arr: 3,
                    das: 4,
                    sdf: 5,
                },
            },
        ],
        play_at: new Date(),
    });

    await nextTick();

    const rendered = h(V2TetrioTetraLeague);

    pages.value.push(rendered);

    await nextTick();
});
</script>

<template>
    <div class="flex flex-col p-2 gap-2">
        <button @click="setLocale('zh-CN')">zh-CN</button>
        <button @click="setLocale('en-US')">en-US</button>
        <template v-for="page in pages">
            <Component :is="page" />
        </template>
    </div>
</template>
