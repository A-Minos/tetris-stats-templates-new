<script lang="ts" setup>
import { z } from 'zod';
import Avatar from '~/types/avatar';
import { Rank } from '~/types/rank';

const data = useData(
    z
        .object({
            show_index: z.boolean(),
            data: z.array(
                z.object({
                    user: z.object({
                        id: z.string(),
                        name: z.string(),
                        avatar: Avatar,
                        country: z.string().nullable(),
                        xp: z.number(),
                    }),

                    tetra_league: z.object({
                        pps: z.number().nullable(),
                        apm: z.number().nullable(),
                        apl: z.number().nullable(),
                        vs: z.number().nullable(),
                        adpl: z.number().nullable(),

                        rank: Rank,
                        tr: z.number(),

                        glicko: z.number().nullable(),
                        rd: z.number().nullable(),
                        decaying: z.boolean(),
                    }),
                }),
            ),
        })
        .readonly(),
);
</script>

<template>
    <v2-layout content_class="max-w-320">
        <template v-for="(item, index) in data.data">
            <v2-tetrio-user-list-user-card
                :index="data.show_index ? index + 1 : null"
                :user="item.user"
                :tetra_league="item.tetra_league"
            />
        </template>
        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
