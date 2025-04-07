<script lang="ts" setup>
import Statistic from '~/types/v2/tetrio/record/statistic';

defineProps<{
    readonly statistic: Statistic;
}>();
</script>

<template>
    <n-card size="small">
        <n-flex justify="space-between">
            <n-text>极简</n-text>

            <n-flex :size="0" align="center">
                <n-text>{{ statistic.finesse.faults }} 多余操作</n-text>
                <n-text :depth="3" class="ml-1 text-xs">({{ statistic.finesse.accuracy }}%)</n-text>
            </n-flex>
        </n-flex>
    </n-card>
</template>
