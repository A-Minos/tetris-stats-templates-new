<script lang="ts" setup>
import type { Rank } from '~/types/rank';

const props = defineProps<{
    readonly rank: Rank;
}>();

const rank_icon = ref();

onMounted(async () => {
    rank_icon.value = await import(`~/assets/images/rank/${props.rank}.svg?url`).then((module) => {
        return module.default;
    });
});
</script>

<template>
    <n-image :src="rank_icon" />
</template>
