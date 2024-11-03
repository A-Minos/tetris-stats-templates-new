<script lang="ts" setup>
import type { VNode } from 'vue';
import Languages from '~/core/shared/languages';
import Trending from '~/core/shared/trending';
import V1TopInfo from '~/pages/v1/top/info/index.vue';

const pages = ref<VNode[]>([]);

onMounted(async () => {
    for (const lang of [Languages.enUS, Languages.zhCN]) {
        document.querySelector('template#data')!.innerHTML = JSON.stringify({
            _lang: lang,
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
        });

        await nextTick();

        const rendered = h(V1TopInfo);

        pages.value.push(rendered);

        await nextTick();
    }
});
</script>

<template>
    <div class="flex flex-col p-2 gap-2">
        <template v-for="page in pages">
            <Component :is="page" />
        </template>
    </div>
</template>
