<script lang="ts" setup>
import { ValidRank } from '~/types/rank';

defineProps<{
    readonly name: ValidRank;
    readonly require_tr: number;
    readonly trending: number;
}>();
</script>

<template>
    <n-flex :size="0" align="center">
        <n-flex align="center" size="small">
            <v2-rank :rank="name" class="[&>img]:size-6" />
            <n-text class="text-5 fw-bold">{{ require_tr }} TR</n-text>
        </n-flex>

        <n-text :type="trending >= 0 ? 'success' : 'error'" class="ml-2 fw-bold">
            {{ trending > 0 ? '↑' : trending < 0 ? '↓' : '→' }}{{ Math.abs(trending) }}
        </n-text>
    </n-flex>
</template>
