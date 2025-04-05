<script setup lang="ts">
import { isNonNullish } from 'remeda';
import { z } from 'zod';
import historyData from '~/types/history-data';
import { Rank } from '~/types/rank';

const data = useData(
    z
        .object({
            user: z.object({
                country: z.string().nullable(),
            }),
            tetra_league: z
                .object({
                    rank: Rank,
                    highest_rank: Rank,

                    tr: z.number(),

                    glicko: z.number().nullable(),
                    rd: z.number().nullable(),

                    global_rank: z.number().nullable(),
                    country_rank: z.number().nullable(),

                    pps: z.number().nullable(),

                    apm: z.number().nullable(),
                    apl: z.number().nullable(),

                    vs: z.number().nullable(),
                    adpl: z.number().nullable(),

                    statistic: z.object({
                        total: z.number(),
                        wins: z.number(),
                    }),

                    decaying: z.boolean(),

                    history: historyData.nullable(),
                })
                .nullable(),
        })
        .readonly(),
);
</script>

<template>
    <template v-if="isNonNullish(data.tetra_league)">
        <v2-tetrio-user-info-tetra-league-history-chart
            v-if="isNonNullish(data.tetra_league.history)"
            :current_tr="data.tetra_league.tr"
            :data="data.tetra_league.history"
        />
        <v2-tetrio-user-info-tetra-league-tr
            :rank="data.tetra_league.rank"
            :tr="data.tetra_league.tr"
            :glicko="data.tetra_league.glicko"
            :rd="data.tetra_league.rd"
            :country="data.user.country"
            :global_rank="data.tetra_league.global_rank"
            :country_rank="data.tetra_league.country_rank"
            :statistic="data.tetra_league.statistic"
            :decaying="data.tetra_league.decaying"
            :highest_rank="data.tetra_league.highest_rank"
        />
        <v2-tetrio-user-info-tetra-league-data
            :pps="data.tetra_league.pps"
            :apm="data.tetra_league.apm"
            :apl="data.tetra_league.apl"
            :vs="data.tetra_league.vs"
            :adpl="data.tetra_league.adpl"
        />
    </template>
</template>
