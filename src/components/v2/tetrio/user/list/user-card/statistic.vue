<script lang="ts" setup>
import { isNonNullish } from 'remeda';

defineProps<{
    readonly tetra_league: {
        readonly pps: number | null;
        readonly apm: number | null;
        readonly apl: number | null;
        readonly vs: number | null;
        readonly adpl: number | null;
    };
}>();
</script>

<template>
    <n-flex :size="0" vertical>
        <div class="text-center w-80">
            <n-flex justify="space-between">
                <n-flex v-if="isNonNullish(tetra_league.pps)" :size="0" vertical>
                    <n-text :depth="3">PPS</n-text>
                    <n-text class="text-5 leading-none">{{ tetra_league.pps }}</n-text>
                </n-flex>

                <n-flex v-if="isNonNullish(tetra_league.apm)" :size="0" vertical>
                    <n-text :depth="3">APM</n-text>
                    <n-text class="text-5 leading-none">{{ tetra_league.apm }}</n-text>

                    <n-text v-if="isNonNullish(tetra_league.apl)" :depth="3" class="text-2"
                        >(x{{ tetra_league.apl }})</n-text
                    >
                </n-flex>

                <n-flex v-if="isNonNullish(tetra_league.vs)" :size="0" vertical>
                    <n-text :depth="3">VS</n-text>
                    <n-text class="text-5 leading-none">{{ tetra_league.vs }}</n-text>

                    <n-text v-if="isNonNullish(tetra_league.adpl)" :depth="3" class="text-2"
                        >(x{{ tetra_league.adpl }})</n-text
                    >
                </n-flex>
            </n-flex>
        </div>
    </n-flex>
</template>
