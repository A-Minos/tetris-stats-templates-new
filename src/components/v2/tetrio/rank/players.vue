<script lang="ts" setup>
defineProps<{
    readonly value: number;
}>();
</script>

<template>
    <n-text class="text-xl">{{ $t('common.player', { count: value }, value) }}</n-text>
</template>
