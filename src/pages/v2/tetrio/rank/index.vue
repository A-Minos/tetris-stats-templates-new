<script setup lang="ts">
import { z } from 'zod';
import { ValidRank } from '~/types/rank';

const { locale } = useI18n();

const data = useData(
    z
        .object({
            items: z.record(
                ValidRank,
                z.object({
                    require_tr: z.number(),
                    trending: z.number(),
                    average_data: z.object({
                        pps: z.number(),
                        apm: z.number(),
                        apl: z.number(),
                        vs: z.number(),
                        adpl: z.number(),
                    }),
                    players: z.number(),
                }),
            ),
            updated_at: z.coerce.date(),
        })
        .readonly(),
);
</script>

<template>
    <v2-layout content_class="max-w-320">
        <template v-for="(rank, name) in data.items">
            <v2-tetrio-rank-card v-if="rank" :name="name" size="small">
                <n-flex justify="space-between">
                    <v2-tetrio-rank-info :name="name" :require_tr="rank.require_tr" :trending="rank.trending" />
                    <v2-tetrio-rank-statistic
                        :pps="rank.average_data.pps"
                        :apm="rank.average_data.apm"
                        :apl="rank.average_data.apl"
                        :vs="rank.average_data.vs"
                        :adpl="rank.average_data.adpl"
                    />
                    <v2-tetrio-rank-players :value="rank.players" />
                </n-flex>
            </v2-tetrio-rank-card>
        </template>

        <n-card size="small">
            <div class="text-center">
                <n-text class="text-xl" type="info">更新时间: {{ data.updated_at.toLocaleString(locale) }}</n-text>
            </div>
        </n-card>

        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
