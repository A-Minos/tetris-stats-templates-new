<script lang="ts" setup>
import type { Component } from 'vue';
import V2TetrioRank from '~/pages/v2/tetrio/rank/index.vue';

const pages = ref<Component[]>([]);

onMounted(async () => {
    window.__DATA__ = JSON.stringify({
        items: {
            u: {
                require_tr: 1145,
                trending: 123,
                average_data: {
                    pps: 1.0,
                    apm: 1.0,
                    apl: 1.0,
                    vs: 1.0,
                    adpl: 1.0,
                },
                players: 1_000,
            },
        },
        updated_at: new Date(),
    });

    await nextTick();

    pages.value.push(h(V2TetrioRank));

    await nextTick();
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
