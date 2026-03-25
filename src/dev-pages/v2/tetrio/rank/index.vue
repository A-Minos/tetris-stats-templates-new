<script lang="ts" setup>
import V2TetrioRank from '~/pages/v2/tetrio/rank/index.vue';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    await addPage({
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
    }, V2TetrioRank);
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
