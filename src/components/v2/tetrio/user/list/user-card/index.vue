<script lang="ts" setup>
import { isNullish } from 'remeda';
import Avatar from '~/types/avatar';
import { Rank } from '~/types/rank';

const props = defineProps<{
    readonly index: number | null;

    readonly user: {
        readonly id: string;
        readonly name: string;
        readonly avatar: Avatar;
        readonly country: string | null;
        readonly xp: number;
    };

    readonly tetra_league: {
        readonly pps: number | null;
        readonly apm: number | null;
        readonly apl: number | null;
        readonly vs: number | null;
        readonly adpl: number | null;

        readonly rank: Rank;
        readonly tr: number;

        readonly glicko: number | null;
        readonly rd: number | null;
        readonly decaying: boolean;
    };
}>();

function checkDecaying(tetra_league: (typeof props)['tetra_league']): boolean {
    if (isNullish(tetra_league.rd)) {
        return false;
    }

    return tetra_league.decaying && tetra_league.rd >= 98;
}
</script>

<template>
    <n-card :class="{ 'opacity-50': checkDecaying(tetra_league) }" size="small">
        <n-flex justify="space-between">
            <v2-tetrio-user-list-user-card-profile :index="index" :user="user" />
            <v2-tetrio-user-list-user-card-statistic :tetra_league="tetra_league" />
            <v2-tetrio-user-list-user-card-tetra-league :tetra_league="tetra_league" />
        </n-flex>
    </n-card>
</template>
