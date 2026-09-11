<script lang="ts" setup>
import { BlitzStatistic } from '~/pages/v2/tetrio/record/blitz/index.vue';

defineProps<{
    readonly statistic: BlitzStatistic;
}>();
</script>

<template>
    <n-flex :size="8" vertical>
        <n-flex justify="space-between">
            <n-text>{{ $t('v2.tetrio.record.block.pieces') }}</n-text>
            <n-text>{{ statistic.pieces }}</n-text>
        </n-flex>

        <n-flex justify="space-between">
            <n-text>{{ $t('v2.tetrio.record.block.pps') }}</n-text>
            <n-text>{{ statistic.pps }}</n-text>
        </n-flex>

        <n-flex justify="space-between">
            <n-text>{{ $t('v2.tetrio.record.block.lines') }}</n-text>
            <n-text>{{ statistic.lines }}</n-text>
        </n-flex>

        <n-flex justify="space-between">
            <n-text>{{ $t('v2.tetrio.record.block.lpm') }}</n-text>
            <n-text>{{ statistic.lpm }}</n-text>
        </n-flex>

        <n-flex justify="space-between">
            <n-text>{{ $t('v2.tetrio.record.block.level') }}</n-text>
            <n-text>{{ statistic.level }}</n-text>
        </n-flex>

        <n-flex justify="space-between">
            <n-text>{{ $t('v2.tetrio.record.block.blitz.score') }}</n-text>
            <n-text>{{ statistic.score }}</n-text>
        </n-flex>

        <n-flex justify="space-between">
            <n-text>{{ $t('v2.tetrio.record.block.blitz.spp') }}</n-text>
            <n-text>{{ statistic.spp }}</n-text>
        </n-flex>
    </n-flex>
</template>
