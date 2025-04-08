<script lang="ts" setup>
defineProps<{
    readonly value: number;
}>();
</script>

<template>
    <n-text class="text-xl">{{ $t('v2.tetrio.rank.player', { value: value }) }}</n-text>
</template>
