<script lang="ts" setup>
import { LineChart } from 'echarts/charts';
import { GridComponent, MarkLineComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { isNonNullish } from 'remeda';
import chart from 'vue-echarts';
import { z } from 'zod';
import point from '~/assets/images/chart/point.svg';
import history from '~/types/v1/history';

use([SVGRenderer, GridComponent, LineChart, MarkLineComponent]);

const data = useData(
    z
        .object({
            multiplayer: z.object({
                rank: z.string(),
                tr: z.string(),
                global_rank: z.number(),

                history: history,
            }),
        })
        .readonly(),
);

const option = computed(() => {
    const interval = 3600 * 24 * 1000;

    return {
        animation: false,
        grid: {
            left: '-5%',
            bottom: '17%',
            width: '90%',
            height: '70%',
        },
        xAxis: {
            type: 'time',
            minInterval: interval,
            maxInterval: interval,
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                formatter: (value: number, index: number) => {
                    if (index === 0 || index % 2 !== 0) {
                        return '';
                    }

                    const date = new Date(value);

                    const month = Number(date.getMonth() + 1)
                        .toString()
                        .padStart(2, '0');

                    const day = date.getDate().toString().padStart(2, '0');

                    if (index === 10) {
                        return `{last_month|${month}}\n{last_day|${day}}`;
                    }

                    return `{month|${month}}\n{day|${day}}`;
                },
                rich: {
                    month: {
                        fontFamily: 'CabinetGrotesk',
                        fontSize: 13,
                        fontWeight: 400,
                        color: '#ffffff99',
                    },
                    day: {
                        fontFamily: 'CabinetGrotesk',
                        fontSize: 20,
                        fontWeight: 800,
                        color: '#ffffff99',
                    },
                    last_month: {
                        fontFamily: 'CabinetGrotesk',
                        fontSize: 13,
                        fontWeight: 400,
                        color: '#373533',
                        backgroundColor: '#fafafa',
                        borderRadius: 6,
                        padding: [-10, 0, 10, 0],
                        width: 36,
                        height: 37,
                        lineHeight: 32,
                    },
                    last_day: {
                        fontFamily: 'CabinetGrotesk',
                        fontSize: 20,
                        fontWeight: 800,
                        color: '#373533',
                        padding: [-18, 0, 0, 0],
                        lineHeight: 0,
                    },
                },
            },
            zlevel: 1,
        },
        yAxis: {
            type: 'value',
            interval: data.multiplayer.history.split_interval,
            position: 'right',
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                align: 'right',
                formatter: (value: number) => {
                    const tr = new Intl.NumberFormat().format(value);

                    return `{value|${tr}}`;
                },
                rich: {
                    value: {
                        fontFamily: 'CabinetGrotesk',
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#ffffff99',
                    },
                },
            },
            offset: 70,
            max: data.multiplayer.history.max_value + data.multiplayer.history.offset,
            min: data.multiplayer.history.min_value - data.multiplayer.history.offset,
        },
        series: [
            {
                data: data.multiplayer.history.data.map((data) => {
                    return [data.record_at, Number(data.score)];
                }),
                type: 'line',
                smooth: true,
                symbol: (
                    _: unknown,
                    series: {
                        readonly dataIndex: number;
                    },
                ) => {
                    if (series.dataIndex === data.multiplayer.history.data.length - 1) {
                        return `image://${point}`;
                    }

                    return 'none';
                },
                symbolSize: 75,
                symbolOffset: [0.79, 0],
                lineStyle: {
                    color: '#fafafa99',
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: '#fafafa4d',
                            },
                            {
                                offset: 1,
                                color: '#fafafa00',
                            },
                        ],
                        global: false,
                    },
                },
                markLine: {
                    data: [
                        [
                            {
                                xAxis: 'max',
                                yAxis: data.multiplayer.history.data[data.multiplayer.history.data.length - 1].score,
                            },
                            {
                                xAxis: 'max',
                                y: '300',
                            },
                        ],
                    ],
                    label: {
                        show: false,
                    },
                    lineStyle: {
                        color: '#fafafa',
                        width: 3,
                        type: 'dashed',
                        cap: 'round',
                    },
                    symbol: 'none',
                    animation: false,
                },
                z: 5,
            },
        ],
    };
});

const initialized = ref(false);

onMounted(() => {
    initialized.value = true;
});

const valid = computed(() => {
    if (!initialized.value) {
        return false;
    }

    return (
        isNonNullish(data.multiplayer.history.data) &&
        isNonNullish(data.multiplayer.history.split_interval) &&
        isNonNullish(data.multiplayer.history.min_value) &&
        isNonNullish(data.multiplayer.history.max_value) &&
        isNonNullish(data.multiplayer.history.offset)
    );
});

const icon_image = ref();

onMounted(async () => {
    icon_image.value = await import(`~/assets/images/rank/${data.multiplayer.rank}.svg?url`).then((module) => {
        return module.default;
    });
});
</script>

<template>
    <template v-if="valid">
        <div class="relative">
            <div
                class="w-143.75 h-68.75 rounded-7.5 bg-gradient-linear bg-gradient-[222deg,#525252_11.97%,#1D1916_89.73%] shadow-[0rem_0.9375rem_1.875rem_0rem_rgba(0,0,0,0.30)]"
            >
                <chart :option="option" />
            </div>

            <div class="absolute top-4.75 left-6">
                <span class="font-template text-6.25 fw-800 text-[#fafafa]">Tetra Rating (TR)</span>
            </div>

            <div class="absolute top-22.5 left-6.75">
                <img :alt="data.multiplayer.rank" :src="icon_image" class="size-12.5" />
            </div>

            <div class="absolute top-35.75 left-6">
                <span class="font-template text-11.25 fw-800 text-[#fafafa]">{{ data.multiplayer.tr }}</span>
                <span class="font-template text-7.5 fw-400 text-[#fafafa]">(#{{ data.multiplayer.global_rank }})</span>
            </div>
        </div>
    </template>
</template>
