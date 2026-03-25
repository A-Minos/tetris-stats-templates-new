<script lang="ts" setup>
import V1TetrioRank from '~/pages/v1/tetrio/rank/index.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    await addPage({
        items: {
            'x+': { trending: 5, require_tr: 25000, players: 100 },
            x: { trending: -3, require_tr: 24000, players: 200 },
            u: { trending: 0, require_tr: 23000, players: 300 },
        },
        updated_at: new Date(),
    }, V1TetrioRank);
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
