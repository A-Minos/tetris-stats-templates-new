<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import { Rank } from '~/types/rank';

defineProps<{
    readonly tetra_league: {
        readonly rank: Rank;
        readonly tr: number;

        readonly glicko: number | null;
        readonly rd: number | null;
        readonly decaying: boolean;
    };
}>();
</script>

<template>
    <n-flex :size="0" vertical>
        <n-flex align="center" size="small">
            <v2-rank :rank="tetra_league.rank" class="[&>img]:size-6" />
            <n-text class="text-5 fw-bold">{{ tetra_league.tr }} TR</n-text>
        </n-flex>

        <n-flex v-if="isNonNullish(tetra_league.glicko) && isNonNullish(tetra_league.rd)" justify="end">
            <v2-tetra-rating :decaying="tetra_league.decaying" :glicko="tetra_league.glicko" :rd="tetra_league.rd" />
        </n-flex>
    </n-flex>
</template>
