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
                <n-text>1 / 2 / 3 / 4</n-text>
                <n-flex :size="0">
                    <n-text>{{ statistic.single }}</n-text>
                    <n-text>&nbsp/&nbsp</n-text>
                    <n-text>{{ statistic.double }}</n-text>
                    <n-text>&nbsp/&nbsp</n-text>
                    <n-text>{{ statistic.triple }}</n-text>
                    <n-text>&nbsp/&nbsp</n-text>
                    <n-text>{{ statistic.quad }}</n-text>
                </n-flex>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>{{ $t('v2.tetrio.record.clear.tspin_mini') }}</n-text>

                <n-flex :size="0">
                    <n-text>{{ statistic.tspins.total }}</n-text>
                    <n-text>&nbsp/&nbsp</n-text>
                    <n-text>{{ statistic.tspins.mini.total }}</n-text>
                </n-flex>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>T1 / T2 / T3</n-text>

                <n-flex :size="0">
                    <n-text>{{ statistic.tspins.single }}</n-text>
                    <n-text>&nbsp/&nbsp</n-text>
                    <n-text>{{ statistic.tspins.double }}</n-text>
                    <n-text>&nbsp/&nbsp</n-text>
                    <n-text>{{ statistic.tspins.triple }}</n-text>
                </n-flex>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>{{ $t('v2.tetrio.record.clear.mini_tspin_single_double') }}</n-text>

                <n-flex :size="0">
                    <n-text>{{ statistic.tspins.mini.single }}</n-text>
                    <n-text>&nbsp/&nbsp</n-text>
                    <n-text>{{ statistic.tspins.mini.double }}</n-text>
                </n-flex>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>{{ $t('v2.tetrio.record.clear.all_clear') }}</n-text>
                <n-text>{{ statistic.all_clear }}</n-text>
            </n-flex>
        </n-flex>
    </n-card>
</template>
