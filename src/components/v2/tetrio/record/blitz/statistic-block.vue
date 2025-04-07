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
                <n-text>块数</n-text>
                <n-text>{{ statistic.pieces }}</n-text>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>块/秒</n-text>
                <n-text>{{ statistic.pps }}</n-text>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>消行</n-text>
                <n-text>{{ statistic.lines }}</n-text>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>消行/分钟</n-text>
                <n-text>{{ statistic.lpm }}</n-text>
            </n-flex>

            <template v-if="isNonNullish(statistic.holds)">
                <n-flex justify="space-between">
                    <n-text>暂存</n-text>
                    <n-text>{{ statistic.holds }}</n-text>
                </n-flex>
            </template>

            <n-flex justify="space-between">
                <n-text>等级</n-text>
                <n-text>{{ statistic.level }}</n-text>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>分数</n-text>
                <n-text>{{ statistic.score }}</n-text>
            </n-flex>

            <n-flex justify="space-between">
                <n-text>分数/块</n-text>
                <n-text>{{ statistic.spp }}</n-text>
            </n-flex>
        </n-flex>
    </n-card>
</template>
