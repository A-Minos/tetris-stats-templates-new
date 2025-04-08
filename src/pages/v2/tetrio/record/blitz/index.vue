<script lang="ts">
import { z } from 'zod';
import Statistic from '~/types/v2/tetrio/record/statistic';

const BlitzStatistic = Statistic.extend({ spp: z.number(), level: z.number() });
type BlitzStatistic = z.infer<typeof BlitzStatistic>;

export { BlitzStatistic };
</script>

<script setup lang="ts">
const { locale } = useI18n();

const data = useData(
    z
        .object({
            statistic: BlitzStatistic,
        })
        .readonly(),
);
</script>

<template>
    <v2-layout content_class="max-w-320">
        <v2-tetrio-record-result
            title="Blitz"
            :result-value="new Intl.NumberFormat(locale).format(data.statistic.score)"
            :statistic="data.statistic"
        />

        <n-flex :wrap="false">
            <v2-tetrio-record-user />

            <n-flex class="flex-1" vertical>
                <n-flex :wrap="false">
                    <n-flex :wrap="false" class="w-1/2" vertical>
                        <v2-tetrio-record-statistic-key :statistic="data.statistic" />
                        <v2-tetrio-record-statistic-max :statistic="data.statistic" />
                        <v2-tetrio-record-replay />
                    </n-flex>

                    <v2-tetrio-record-blitz-statistic-block :statistic="data.statistic" />

                    <v2-tetrio-record-statistic-clear :statistic="data.statistic" />
                </n-flex>

                <v2-tetrio-record-statistic-finesse :statistic="data.statistic" />
            </n-flex>
        </n-flex>

        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
