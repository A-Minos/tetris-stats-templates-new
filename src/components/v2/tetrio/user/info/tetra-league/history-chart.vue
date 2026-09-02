<script lang="ts" setup>
import { Chart } from '@antv/g2';
import { tryOnMounted } from '@vueuse/core';
import type { historyData } from '~/types/history-data';

const { locale, t } = useI18n();

const props = defineProps<{
    readonly current_tr: number;
    readonly data: historyData;
}>();

const container = ref<HTMLElement>();

tryOnMounted(() => {
    const chart = new Chart({
        container: container.value,
        autoFit: true,
        theme: 'dark',
    });

    const setOptions = () => {
        chart.options({
            type: 'view',

            data: {
                value: props.data,
            },

            axis: {
                x: {
                    labelFormatter: (date: Date) => date.toLocaleDateString(locale.value),
                },
                y: {
                    title: t('common.tetra_rating'),
                },
            },

            encode: {
                x: (data: historyData[number]) => {
                    return data.record_at;
                },
                y: (data: historyData[number]) => {
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
    };

    setOptions();
    setTimeout(() => {
        chart.render();
    }, 0);

    watch(locale, () => {
        setOptions();
        chart.render();
    });
});
</script>

<template>
    <n-card size="small">
        <div ref="container" class="h-80" />
    </n-card>
</template>
