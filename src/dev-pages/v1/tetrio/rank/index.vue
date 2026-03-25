<script lang="ts" setup>
import type { Component } from 'vue';
import V1TetrioRank from '~/pages/v1/tetrio/rank/index.vue';

const pages = ref<Component[]>([]);

onMounted(async () => {
    window.__DATA__ = JSON.stringify({
        items: {
            'x+': { trending: 5, require_tr: 25000, players: 100 },
            x: { trending: -3, require_tr: 24000, players: 200 },
            u: { trending: 0, require_tr: 23000, players: 300 },
        },
        updated_at: new Date(),
    });

    await nextTick();

    pages.value.push(h(V1TetrioRank));

    await nextTick();
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
