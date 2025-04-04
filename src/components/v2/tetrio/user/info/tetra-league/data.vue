<script setup lang="ts">
import { isNonNullish } from 'remeda';

defineProps<{
    readonly pps: number | null;

    readonly apm: number | null;
    readonly apl: number | null;

    readonly vs: number | null;
    readonly adpl: number | null;
}>();
</script>

<template>
    <n-card size="small">
        <div class="text-center">
            <n-flex justify="space-evenly">
                <template v-if="isNonNullish(pps)">
                    <n-statistic :value="pps" label="PPS" />
                </template>

                <template v-if="isNonNullish(apm)">
                    <n-statistic label="APM">
                        <n-flex :size="0" vertical>
                            <n-text>{{ apm }}</n-text>

                            <template v-if="isNonNullish(apl)">
                                <n-text :depth="3" class="text-sm"> (x{{ apl }}) </n-text>
                            </template>
                        </n-flex>
                    </n-statistic>
                </template>

                <template v-if="isNonNullish(vs)">
                    <n-statistic label="VS">
                        <n-flex :size="0" vertical>
                            <n-text>{{ vs }}</n-text>

                            <template v-if="isNonNullish(adpl)">
                                <n-text :depth="3" class="text-sm"> (x{{ adpl }}) </n-text>
                            </template>
                        </n-flex>
                    </n-statistic>
                </template>
            </n-flex>
        </div>
    </n-card>
</template>
