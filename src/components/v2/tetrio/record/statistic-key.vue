<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import Statistic from '~/types/v2/tetrio/record/statistic';

defineProps<{
    readonly statistic: Statistic;
}>();
</script>

<template>
    <n-flex :size="8" vertical>
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

        <n-flex v-if="isNonNullish(statistic.holds)" justify="space-between">
            <n-text>{{ $t('v2.tetrio.record.block.holds') }}</n-text>
            <n-text>{{ statistic.holds }}</n-text>
        </n-flex>
    </n-flex>
</template>
