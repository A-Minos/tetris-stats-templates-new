<script lang="ts" setup>
import { z } from 'zod';
import Statistic from '~/types/v2/tetrio/record/statistic';

const data = useData(
    z
        .object({
            time: z.string(),

            statistic: Statistic,
        })
        .readonly(),
);

const title = computed(() => {
    if (data.statistic.tspins.double >= 20) {
        return '20TSD';
    }

    if (data.statistic.all_clear >= 10) {
        return '10PC';
    }

    return '40L';
});
</script>

<template>
    <v2-layout content_class="max-w-320">
        <v2-tetrio-record-result :title="title" :result-value="data.time" :statistic="data.statistic" />

        <n-flex :wrap="false">
            <v2-tetrio-record-user />

            <n-flex class="flex-1" vertical>
                <n-flex :wrap="false">
                    <n-flex :wrap="false" class="w-1/2" vertical>
                        <v2-tetrio-record-statistic-key :statistic="data.statistic" />
                        <v2-tetrio-record-statistic-max :statistic="data.statistic" />
                    </n-flex>

                    <v2-tetrio-record-sprint-statistic-block :statistic="data.statistic" />

                    <v2-tetrio-record-statistic-clear :statistic="data.statistic" />
                </n-flex>

                <n-flex :wrap="false">
                    <v2-tetrio-record-replay />
                    <v2-tetrio-record-statistic-finesse :statistic="data.statistic" />
                </n-flex>
            </n-flex>
        </n-flex>

        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
