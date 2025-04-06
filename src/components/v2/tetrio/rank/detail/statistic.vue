<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import { StatisticalData } from '~/pages/v2/tetrio/rank/detail/index.vue';

defineProps<{
    data: StatisticalData;
}>();
</script>

<template>
    <div class="w-80 text-left">
        <n-list>
            <n-list-item>
                <n-flex align="center" justify="space-between">
                    <n-flex :size="0" vertical>
                        <n-text type="info">L'PM: {{ data.lpm }}</n-text>
                        <n-text type="info">PPS: {{ data.pps }}</n-text>
                    </n-flex>

                    <n-text type="success">{{ data.pps_holder }}</n-text>
                </n-flex>
            </n-list-item>

            <n-list-item>
                <n-flex align="center" justify="space-between">
                    <n-flex size="small" align="center">
                        <n-text type="info">APM: {{ data.apm }}</n-text>
                        <n-text v-if="isNonNullish(data.apl)" :depth="3" class="text-2">(x{{ data.apl }})</n-text>
                    </n-flex>

                    <n-text type="success">{{ data.apm_holder }}</n-text>
                </n-flex>
            </n-list-item>

            <n-list-item>
                <n-flex align="center" justify="space-between">
                    <n-flex align="center" size="small">
                        <n-flex :size="0" vertical>
                            <n-text type="info">ADPM: {{ data.adpm }}</n-text>
                            <n-text type="info">VS: {{ data.vs }}</n-text>
                        </n-flex>

                        <n-text v-if="isNonNullish(data.adpl)" :depth="3" class="text-2">(x{{ data.adpl }})</n-text>
                    </n-flex>

                    <n-text type="success">{{ data.vs_holder }}</n-text>
                </n-flex>
            </n-list-item>
        </n-list>
    </div>
</template>
