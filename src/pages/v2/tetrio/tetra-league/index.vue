<script lang="ts" setup>
import { z } from 'zod';
import { getAvatar } from '~/components/shared/avatar.vue';
import Avatar from '~/types/avatar';

const Stats = z.object({
    pps: z.number(),
    apm: z.number(),
    vs: z.number(),
});

const data = useData(
    z
        .object({
            matches: z.array(
                z.object({
                    sequence: z.number(),
                    replay_id: z.string(),
                    played_at: z.coerce.date(),
                    user: z.object({
                        id: z.string(),
                        name: z.string(),
                        avatar: Avatar,
                        country: z.string().nullable(),
                        stats: Stats,
                    }),
                    opponent: z.object({
                        id: z.string(),
                        name: z.string(),
                        avatar: Avatar,
                        country: z.string().nullable(),
                        stats: Stats,
                    }),
                    is_winner: z.boolean(),
                    score: z.object({
                        user: z.number(),
                        opponent: z.number(),
                    }),
                }),
            ),
        })
        .readonly(),
);

const statKeys = ['pps', 'apm', 'vs'] as const;

type StatKey = (typeof statKeys)[number];
type Stats = z.infer<typeof Stats>;

const statRatios: Record<StatKey, number> = {
    pps: 1,
    apm: 36,
    vs: 48,
};

const statColors: Record<StatKey, string> = {
    pps: 'bg-red-5',
    apm: 'bg-blue-5',
    vs: 'bg-amber-5',
};

function normalizedStatValue(stat: StatKey, value: number) {
    return value / statRatios[stat];
}

function barWidth(stat: StatKey, value: number, userStats: Stats, opponentStats: Stats) {
    const max = statKeys.reduce(
        (currentMax, key) =>
            Math.max(
                currentMax,
                normalizedStatValue(key, userStats[key]),
                normalizedStatValue(key, opponentStats[key]),
            ),
        1,
    );

    return `${(normalizedStatValue(stat, value) / max) * 100}%`;
}

useLang();
</script>

<template>
    <v2-layout content_class="max-w-320">
        <template v-for="match in data.matches" :key="match.sequence">
            <n-card :class="match.is_winner ? 'bg-green' : 'bg-red'" class="bg-opacity-10" size="small">
                <n-flex :wrap="false" align="center" justify="space-between">
                    <n-flex align="center" :size="4" class="shrink-0">
                        <n-text class="text-4 fw-bold" type="info">#{{ match.sequence }}</n-text>
                        <n-image :img-props="{ class: 'size-10' }" :src="getAvatar(match.user.avatar)" />
                        <n-flex :size="0" vertical>
                            <n-flex align="center" size="small">
                                <n-text class="text-5 fw-bold">{{ match.user.name }}</n-text>
                                <v2-country v-if="match.user.country" :code="match.user.country" class="[&>img]:h-4" />
                            </n-flex>
                            <n-text :depth="3" class="text-3">{{ match.user.id }}</n-text>
                        </n-flex>
                    </n-flex>

                    <div class="mx-2 min-w-0 flex flex-1 flex-col gap-0.5">
                        <div v-for="stat in statKeys" :key="stat" class="flex items-center gap-1 text-2.5">
                            <span class="w-7 shrink-0 text-right ws-nowrap text-white/50 uppercase">{{ stat }}</span>
                            <div class="min-w-0 flex-1">
                                <div
                                    class="h-2.5 rounded-0.5"
                                    :class="statColors[stat]"
                                    :style="{
                                        width: barWidth(
                                            stat,
                                            match.user.stats[stat],
                                            match.user.stats,
                                            match.opponent.stats,
                                        ),
                                    }"
                                />
                            </div>
                            <span class="ws-nowrap font-mono text-white/80">{{ match.user.stats[stat] }}</span>
                        </div>
                    </div>

                    <n-text class="mx-2 shrink-0 text-8 fw-bold font-mono">
                        <n-text :type="match.is_winner ? 'success' : 'error'">{{ match.score.user }}</n-text>
                        <n-text :depth="3"> - </n-text>
                        <n-text :type="match.is_winner ? 'error' : 'success'">{{ match.score.opponent }}</n-text>
                    </n-text>

                    <div class="mx-2 min-w-0 flex flex-1 flex-col gap-0.5">
                        <div
                            v-for="stat in statKeys"
                            :key="stat"
                            class="flex flex-row-reverse items-center gap-1 text-2.5"
                        >
                            <span class="w-7 shrink-0 ws-nowrap text-left text-white/50 uppercase">{{ stat }}</span>
                            <div class="min-w-0 flex-1">
                                <div
                                    class="ml-auto h-2.5 rounded-0.5"
                                    :class="statColors[stat]"
                                    :style="{
                                        width: barWidth(
                                            stat,
                                            match.opponent.stats[stat],
                                            match.user.stats,
                                            match.opponent.stats,
                                        ),
                                    }"
                                />
                            </div>
                            <span class="ws-nowrap font-mono text-white/80">{{ match.opponent.stats[stat] }}</span>
                        </div>
                    </div>

                    <n-flex align="center" :size="4" class="shrink-0">
                        <n-flex :size="0" vertical class="text-right">
                            <n-flex align="center" justify="end" size="small">
                                <v2-country
                                    v-if="match.opponent.country"
                                    :code="match.opponent.country"
                                    class="[&>img]:h-4"
                                />
                                <n-text class="text-5 fw-bold">{{ match.opponent.name }}</n-text>
                            </n-flex>
                            <n-text :depth="3" class="text-3">{{ match.opponent.id }}</n-text>
                        </n-flex>
                        <n-image :img-props="{ class: 'size-10' }" :src="getAvatar(match.opponent.avatar)" />
                    </n-flex>
                </n-flex>
            </n-card>
        </template>

        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
