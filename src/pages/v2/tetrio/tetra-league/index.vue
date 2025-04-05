<script lang="ts" setup>
import { z } from 'zod';

const StatisticalData = z.object({
    pps: z.number(),
    apm: z.number(),
    apl: z.number(),
    vs: z.number(),
    adpl: z.number(),
});

const data = useData(
    z
        .object({
            replay_id: z.string(),
            games: z.array(
                z.object({
                    user: z.object({
                        id: z.string(),
                        name: z.string(),
                    }),
                    points: z.number(),
                    average_data: StatisticalData,
                    data: z.array(StatisticalData),
                    handling: z.object({
                        arr: z.number(),
                        das: z.number(),
                        sdf: z.number(),
                    }),
                }),
            ),
            play_at: z.coerce.date(),
        })
        .readonly(),
);

const winner_user_id = computed(() => {
    return data.games.toSorted((a, b) => {
        return b.points - a.points;
    })[0].user.id;
});
</script>

<template>
    <v2-layout content_class="max-w-320">
        <n-grid :cols="data.games.length" :x-gap="10" :y-gap="10">
            <n-grid-item v-for="game in data.games">
                <v2-tetrio-tetra-league-player
                    :average_data="game.average_data"
                    :is_winner="winner_user_id === game.user.id"
                    :points="game.points"
                    :user="game.user"
                />
            </n-grid-item>
        </n-grid>

        <v2-tetrio-tetra-league-replay-id :replay_id="data.replay_id" />

        <n-flex class="[&_*]:!text-4" vertical>
            <n-grid :cols="data.games.length" :x-gap="10" :y-gap="10">
                <n-grid-item v-for="game in data.games">
                    <n-grid :cols="1" :x-gap="10" :y-gap="10">
                        <n-grid-item v-for="data in game.data">
                            <v2-tetrio-tetra-league-round
                                :adpl="data.adpl"
                                :apl="data.apl"
                                :apm="data.apm"
                                :pps="data.pps"
                                :vs="data.vs"
                            />
                        </n-grid-item>
                    </n-grid>
                </n-grid-item>
            </n-grid>

            <n-grid :cols="data.games.length" :x-gap="10" :y-gap="10">
                <n-grid-item v-for="game in data.games">
                    <v2-tetrio-tetra-league-handling
                        :arr="game.handling.arr"
                        :das="game.handling.das"
                        :sdf="game.handling.sdf"
                    />
                </n-grid-item>
            </n-grid>
        </n-flex>

        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
