<script lang="ts" setup>
import Statistic from '~/types/v2/tetrio/record/statistic';

defineProps<{
    readonly statistic: Statistic;
}>();
</script>

<template>
    <n-card size="small">
        <n-flex justify="space-between">
            <n-text>{{ $t('v2.tetrio.record.finesse.title') }}</n-text>

            <n-flex :size="0" align="center">
                <n-text>{{ statistic.finesse.faults }} {{ $t('v2.tetrio.record.finesse.faults') }}</n-text>
                <n-text :depth="3" class="ml-1 text-xs">({{ statistic.finesse.accuracy }}%)</n-text>
            </n-flex>
        </n-flex>
    </n-card>
</template>
