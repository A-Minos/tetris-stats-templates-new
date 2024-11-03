<script lang="ts" setup>
import { LineChart } from 'echarts/charts';
import { GridComponent, MarkLineComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { isNonNullish } from 'remeda';
import chart from 'vue-echarts';
import card from '~/assets/images/chart/card.svg';
import point from '~/assets/images/chart/point.svg';

use([SVGRenderer, GridComponent, LineChart, MarkLineComponent]);

const data = useData<{
    readonly multiplayer: {
        readonly history: {
            readonly data: {
                readonly record_at: Date;
                readonly tr: number;
            }[];

            readonly split_interval: number;
            readonly min_tr: number;
            readonly max_tr: number;
            readonly offset: number;
        };
    };
}>();

const option = computed(() => {
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
            minInterval: 3600 * 24 * 1000,
            maxInterval: 3600 * 24 * 1000,
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                formatter: (value: number, index: number) => {
                    const date = new Date(value);

                    const month = Number(date.getMonth() + 1)
                        .toString()
                        .padStart(2, '0');

                    const day = date.getDate().toString().padStart(2, '0');

                    if (index === data.multiplayer.history.data.length) {
                        return `{last_month|${month}}\n{last_day|${day}}`;
                    }

                    if (index === 0 || index % 2 !== 0) {
                        return '';
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
                    const nf = new Intl.NumberFormat();
                    const tr = nf.format(value);

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
            max: data.multiplayer.history.max_tr + data.multiplayer.history.offset,
            min: data.multiplayer.history.min_tr - data.multiplayer.history.offset,
        },
        series: [
            {
                data: data.multiplayer.history.data.map((data) => {
                    return [data.record_at, Number(data.tr)];
                }),
                type: 'line',
                smooth: true,
                endLabel: {
                    position: 'left',
                    offset: [-20, 20],
                    show: true,
                    formatter: ['{rating|{@[1]}}', '{rd|±340.12}'].join('\n'),
                    align: 'right',
                    backgroundColor: {
                        image: card,
                    },
                    borderRadius: 5,
                    padding: [15, 20, 10, 10],
                    rich: {
                        rating: {
                            fontSize: 45,
                            fontWeight: 800,
                            fontFamily: 'CabinetGrotesk',
                            lineHeight: 40,
                            color: '#1d1916',
                        },
                        rd: {
                            fontSize: 30,
                            fontFamily: 'CabinetGrotesk',
                            color: '#1d1916',
                        },
                    },
                },
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
                                yAxis: data.multiplayer.history.data[data.multiplayer.history.data.length - 1]['tr'],
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
        isNonNullish(data.multiplayer.history.min_tr) &&
        isNonNullish(data.multiplayer.history.max_tr) &&
        isNonNullish(data.multiplayer.history.offset)
    );
});
</script>

<template>
    <template v-if="valid">
        <div
            class="w-143.75 h-68.75 rounded-7.5"
            style="
                background: linear-gradient(222deg, #525252 11.97%, #1d1916 89.73%);
                box-shadow: 0 0.9375rem 1.875rem 0 #0000004d;
            "
        >
            <chart :option="option" />
        </div>
    </template>
</template>
