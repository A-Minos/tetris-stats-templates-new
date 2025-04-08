<script lang="ts" setup>
import type { VNode } from 'vue';
import V2TetrioList from '~/pages/v2/tetrio/user/list/index.vue';

const { setLocale } = useI18n();

const pages = ref<VNode[]>([]);

onMounted(async () => {
    window.__DATA__ = JSON.stringify({
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
    });

    await nextTick();

    const rendered = h(V2TetrioList);

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
