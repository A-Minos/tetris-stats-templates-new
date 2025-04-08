<script lang="ts">
const StatisticalData = z.object({
    pps: z.number(),
    lpm: z.number(),
    apm: z.number(),
    apl: z.number().nullable(),
    vs: z.number(),
    adpm: z.number(),
    adpl: z.number().nullable(),
    pps_holder: z.string().nullable(),
    apm_holder: z.string().nullable(),
    vs_holder: z.string().nullable(),
});

type StatisticalData = z.infer<typeof StatisticalData>;

export { StatisticalData };
</script>

<script lang="ts" setup>
import { z } from 'zod';
import { ValidRank } from '~/types/rank';

const { locale } = useI18n();

const data = useData(
    z
        .object({
            name: ValidRank,
            trending: z.number(),
            require_tr: z.number(),
            players: z.number(),

            minimum_data: StatisticalData,
            average_data: StatisticalData,
            maximum_data: StatisticalData,

            updated_at: z.coerce.date(),
        })
        .readonly(),
);
</script>

<template>
    <v2-layout content_class="max-w-320">
        <v2-tetrio-rank-card :name="data.name" size="small">
            <n-flex vertical>
                <n-flex justify="space-between">
                    <v2-tetrio-rank-detail-info
                        :name="data.name"
                        :players="data.players"
                        :require_tr="data.require_tr"
                    />
                    <v2-tetrio-rank-trending :trending="data.trending" />
                </n-flex>

                <n-flex justify="center">
                    <n-card class="w-fit text-center" size="small" :title="$t('v2.tetrio.rank.detail.minimum_data')">
                        <v2-tetrio-rank-detail-statistic :data="data.minimum_data" />
                    </n-card>

                    <n-card class="w-fit text-center" size="small" :title="$t('v2.tetrio.rank.detail.average_data')">
                        <v2-tetrio-rank-detail-statistic :data="data.average_data" />
                    </n-card>

                    <n-card class="w-fit text-center" size="small" :title="$t('v2.tetrio.rank.detail.maximum_data')">
                        <v2-tetrio-rank-detail-statistic :data="data.maximum_data" />
                    </n-card>
                </n-flex>

                <div class="text-center">
                    <n-text :depth="3">{{
                        $t('v2.tetrio.rank.update_time', { time: data.updated_at.toLocaleString(locale) })
                    }}</n-text>
                </div>
            </n-flex>
        </v2-tetrio-rank-card>

        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
