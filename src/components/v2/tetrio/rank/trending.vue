<script lang="ts" setup>
defineProps<{
    readonly trending: number;
}>();
</script>

<template>
    <n-text :type="trending > 0 ? 'success' : trending < 0 ? 'error' : 'warning'" class="ml-2 fw-bold">
        {{ trending > 0 ? '↑' : trending < 0 ? '↓' : '→' }}{{ Math.abs(trending) }}
    </n-text>
</template>
