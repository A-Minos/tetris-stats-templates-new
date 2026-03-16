<script lang="ts">
import { z } from 'zod';

const AverageData = z.object({
    pps: z.number(),
    apm: z.number(),
    apl: z.number(),
    vs: z.number(),
    adpl: z.number(),
});

type AverageData = z.infer<typeof AverageData>;

export { AverageData };
</script>

<script lang="ts" setup>
import { ValidRank } from '~/types/rank';

const { locale } = useI18n();

const data = useData(
    z
        .object({
            items: z.partialRecord(
                ValidRank,
                z.object({
                    require_tr: z.number(),
                    trending: z.number(),
                    average_data: AverageData,
                    players: z.number(),
                }),
            ),
            updated_at: z.coerce.date(),
        })
        .readonly(),
);

useLang();
</script>

<template>
    <v2-layout content_class="max-w-320">
        <template v-for="(rank, name) in data.items">
            <v2-tetrio-rank-card v-if="rank" :name="name" size="small">
                <n-flex justify="space-between">
                    <v2-tetrio-rank-info :name="name" :require_tr="rank.require_tr" :trending="rank.trending" />
                    <v2-tetrio-rank-statistic :average_data="rank.average_data" />
                    <v2-tetrio-rank-players :value="rank.players" />
                </n-flex>
            </v2-tetrio-rank-card>
        </template>

        <n-card size="small">
            <div class="text-center">
                <n-text class="text-xl" type="info">{{
                    $t('v2.tetrio.rank.update_time', { time: data.updated_at.toLocaleString(locale) })
                }}</n-text>
            </div>
        </n-card>

        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
