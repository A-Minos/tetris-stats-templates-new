<script lang="ts" setup>
import { Chart } from '@antv/g2';
import { tryOnMounted } from '@vueuse/core';
import type { historyDataType } from '~/types/history-data';

const props = defineProps<{
    readonly current_tr: number;
    readonly data: historyDataType;
}>();

const container = ref<HTMLElement>();

tryOnMounted(() => {
    const chart = new Chart({
        container: container.value,
        autoFit: true,
        theme: 'dark',
    });

    chart.options({
        type: 'view',

        data: {
            value: props.data,
        },

        axis: {
            x: {
                labelFormatter: (date: Date) => date.toLocaleDateString('zh-CN'),
            },
            y: {
                title: 'Tetra Rating',
            },
        },

        encode: {
            x: (data: historyDataType[number]) => {
                return data.record_at;
            },
            y: (data: historyDataType[number]) => {
                return Number(data.score);
            },
        },

        children: [
            {
                type: 'line',
            },
            {
                type: 'point',
            },
        ],
    });

    setTimeout(() => {
        chart.render();
    }, 0);
});
</script>

<template>
    <n-card size="small">
        <div ref="container" class="h-80" />
    </n-card>
</template>
