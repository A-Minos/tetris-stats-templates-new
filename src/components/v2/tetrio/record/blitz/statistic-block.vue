<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import { BlitzStatistic } from '~/pages/v2/tetrio/record/blitz/index.vue';

defineProps<{
    readonly statistic: BlitzStatistic;
}>();
</script>

<template>
    <n-card class="w-1/2" size="small">
        <n-flex :size="0" vertical>
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

            <template v-if="isNonNullish(statistic.holds)">
                <n-flex justify="space-between">
                    <n-text>{{ $t('v2.tetrio.record.block.holds') }}</n-text>
                    <n-text>{{ statistic.holds }}</n-text>
                </n-flex>
            </template>

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
    </n-card>
</template>
