<script lang="ts" setup>
import type { RadarSeriesOption } from 'echarts/charts';
import { RadarChart } from 'echarts/charts';
import type { ComposeOption } from 'echarts/core';
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { isNonNullish } from 'remeda';
import chart from 'vue-echarts';
import { z } from 'zod';
const data = useData(
    z
        .object({
            multiplayer: z.object({
                app: z.number(),
                ci: z.number(),
                dspp: z.number(),
                dsps: z.number(),
                ge: z.number(),
                pps: z.number(),
            }),
        })
        .readonly(),
);

use([SVGRenderer, RadarChart]);

type ChartOption = ComposeOption<RadarSeriesOption>;

const option = computed<ChartOption>(() => {
    return {
        animation: false,
        radar: [
            {
                indicator: [
                    {
                        name: 'APP',
                        nameRotate: 0,
                    },
                    {
                        name: 'CI',
                        nameRotate: 60,
                    },
                    {
                        name: 'DSPP',
                        nameRotate: -60,
                    },
                    {
                        name: 'DSPS',
                        nameRotate: 0,
                    },
                    {
                        name: 'GE',
                        nameRotate: 60,
                    },
                    {
                        name: 'PPS',
                        nameRotate: 300,
                    },
                ],
                center: ['50%', '50%'],
                radius: '65%',
                startAngle: 90,
                splitNumber: 4,
                shape: 'circle',
                silent: true,
                axisName: {
                    color: '#fafafa',
                    fontFamily: 'CabinetGrotesk',
                    fontSize: 15,
                    fontWeight: '800',
                },
                splitArea: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#fafafa4d',
                    },
                },
                axisLabel: {
                    show: true,
                    rotate: 0,
                    margin: -1,
                    fontFamily: 'CabinetGrotesk',
                    fontSize: 7,
                    fontWeight: '800',
                    color: 'white',
                },
                splitLine: {
                    lineStyle: {
                        color: '#fafafa4d',
                    },
                },
            },
        ],
        series: [
            {
                type: 'radar',
                symbol: 'none',
                label: {
                    show: true,
                },
                emphasis: {
                    disabled: true,
                },
                lineStyle: {
                    color: '#fafafa',
                    width: 2.5,
                    shadowBlur: 20,
                    shadowColor: '#fafafa',
                },
                areaStyle: {
                    color: '#fafafa73',
                },
                data: [
                    {
                        value: [
                            data.multiplayer.app,
                            data.multiplayer.ci,
                            data.multiplayer.dspp,
                            data.multiplayer.dsps,
                            data.multiplayer.ge,
                            data.multiplayer.pps,
                        ],
                    },
                ],
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
        isNonNullish(data.multiplayer.app) &&
        isNonNullish(data.multiplayer.ci) &&
        isNonNullish(data.multiplayer.dspp) &&
        isNonNullish(data.multiplayer.dsps) &&
        isNonNullish(data.multiplayer.ge) &&
        isNonNullish(data.multiplayer.pps)
    );
});
</script>

<template>
    <template v-if="valid">
        <div
            class="size-68.75 rounded-7.5"
            style="
                background: linear-gradient(222deg, #525252 11.97%, #1d1916 89.73%),
                    linear-gradient(222deg, #4f9dff 11.97%, #2563ea 89.73%);
                box-shadow: 0 0.9375rem 1.875rem 0 #0000004d;
                filter: drop-shadow(0 0 1.9375rem #fafafa66);
            "
        >
            <chart :option="option" />
        </div>
    </template>
</template>
