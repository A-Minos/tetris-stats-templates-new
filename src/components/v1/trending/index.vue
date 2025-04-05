<script lang="ts" setup>
defineProps<{
    trending: Trending;
}>();
</script>

<script lang="ts">
export enum Trending {
    UP = 'up',
    KEEP = 'keep',
    DOWN = 'down',
}
</script>

<template>
    <v1-trending-up v-if="trending === Trending.UP" />
    <v1-trending-keep v-else-if="trending === Trending.KEEP" />
    <v1-trending-down v-else-if="trending === Trending.DOWN" />
</template>
