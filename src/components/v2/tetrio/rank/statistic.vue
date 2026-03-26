<script lang="ts" setup>
import type { AverageData } from '~/types/v2/tetrio/average-data';
defineProps<{
    readonly average_data: AverageData;
}>();
</script>

<template>
    <n-flex :size="0" vertical>
        <div class="text-center w-80">
            <n-flex justify="space-between">
                <n-flex :size="0" vertical>
                    <n-text :depth="3">PPS</n-text>
                    <n-text class="text-5 leading-none">{{ average_data.pps }}</n-text>
                </n-flex>

                <n-flex :size="0" vertical>
                    <n-text :depth="3">APM</n-text>
                    <n-text class="text-5 leading-none">{{ average_data.apm }}</n-text>
                    <n-text :depth="3" class="text-2">(x{{ average_data.apl }})</n-text>
                </n-flex>

                <n-flex :size="0" vertical>
                    <n-text :depth="3">VS</n-text>
                    <n-text class="text-5 leading-none">{{ average_data.vs }}</n-text>
                    <n-text :depth="3" class="text-2">(x{{ average_data.adpl }})</n-text>
                </n-flex>
            </n-flex>
        </div>
    </n-flex>
</template>
