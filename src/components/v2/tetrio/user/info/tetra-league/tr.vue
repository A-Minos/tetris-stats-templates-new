<script setup lang="ts">
import { isNonNullish } from 'remeda';
import type Rank from '~/types/rank';

const props = defineProps<{
    readonly rank: Rank;
    readonly tr: number;

    readonly glicko: number | null;
    readonly rd: number | null;

    readonly country: string | null;

    readonly global_rank: number | null;
    readonly country_rank: number | null;

    readonly statistic: {
        readonly total: number;
        readonly wins: number;
    } | null;

    readonly decaying: boolean;
    readonly highest_rank: Rank | null;
}>();
</script>

<template>
    <n-card size="small">
        <n-flex :size="0" vertical>
            <n-flex align="center" justify="space-between">
                <n-flex align="center" size="small">
                    <v2-rank :rank="props.rank" class="[&>img]:size-15" />

                    <n-flex :size="0" vertical>
                        <n-text class="text-2xl fw-bold">{{ tr }} TR</n-text>
                        <v2-tetra-rating :decaying="decaying" :glicko="glicko" :rd="rd" />
                    </n-flex>
                </n-flex>

                <template v-if="[global_rank, country_rank].some(isNonNullish)">
                    <div class="text-right">
                        <n-flex :size="0" vertical>
                            <template v-if="isNonNullish(global_rank)">
                                <n-text class="text-sm fw-bold" type="success"> #{{ global_rank }} </n-text>
                            </template>

                            <template v-if="isNonNullish(country) && isNonNullish(country_rank)">
                                <n-text class="text-sm fw-bold" type="info">
                                    {{ country.toUpperCase() }}#{{ country_rank }}
                                </n-text>
                            </template>
                        </n-flex>
                    </div>
                </template>
            </n-flex>

            <n-flex :size="0" align="center" justify="center">
                <template v-if="isNonNullish(statistic)">
                    <n-text :depth="3" class="text-sm">
                        {{
                            $t('v2.tetrio.user.info.tetra_league.win_rate', {
                                wins: statistic.wins,
                                total: statistic.total,
                                rate: ((statistic.wins / statistic.total) * 100).toFixed(2),
                            })
                        }}
                    </n-text>

                    <n-divider vertical />
                </template>

                <template v-if="isNonNullish(highest_rank)">
                    <n-text :depth="3">{{ $t('v2.tetrio.user.info.tetra_league.highest') }}</n-text>
                    <v2-rank :rank="highest_rank" class="[&>img]:size-4" />
                </template>
            </n-flex>
        </n-flex>
    </n-card>
</template>
