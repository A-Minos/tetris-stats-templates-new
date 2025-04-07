<script lang="ts" setup>
import Statistic from '~/types/v2/tetrio/record/statistic';

defineProps<{
    readonly statistic: Statistic;
}>();
</script>

<template>
    <n-card size="small">
        <n-flex :size="0" vertical>
            <n-flex justify="space-between">
                <n-text>最大连击</n-text>
                <n-text>{{ statistic.max.combo }}</n-text>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>最大 b2b</n-text>
                <n-text>{{ statistic.max.btb }}</n-text>
            </n-flex>
        </n-flex>
    </n-card>
</template>
