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
                <n-text>{{ $t('v2.tetrio.record.key.keys') }}</n-text>
                <n-text>{{ statistic.keys }}</n-text>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>{{ $t('v2.tetrio.record.key.kpp') }}</n-text>
                <n-text>{{ statistic.kpp }}</n-text>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>{{ $t('v2.tetrio.record.key.kps') }}</n-text>
                <n-text>{{ statistic.kps }}</n-text>
            </n-flex>
        </n-flex>
    </n-card>
</template>
