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

useLang();
</script>

<template>
    <v2-layout content_class="max-w-320">
        <v2-tetrio-record-result :title="title" :result-value="data.time" :statistic="data.statistic">
            <template #efficiency>
                <v2-tetrio-record-sprint-statistic-block :statistic="data.statistic" />
            </template>
        </v2-tetrio-record-result>
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
