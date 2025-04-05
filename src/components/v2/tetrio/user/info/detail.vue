<script lang="ts" setup>
import { ClockCircleOutlined } from '@vicons/antd';
import { formatDistanceToNow } from 'date-fns';
import { isNonNullish } from 'remeda';
import { z } from 'zod';
import { calculateXpLevel } from '~/utils/xp';

const data = useData(
    z
        .object({
            user: z.object({
                xp: z.number(),

                playtime: z.string().nullable(),
                join_at: z.coerce.date().nullable(),
            }),
            statistic: z
                .object({
                    total: z.number().nullable(),
                    wins: z.number().nullable(),
                })
                .nullable(),
        })
        .readonly(),
);

const xp_level = computed(() => {
    return calculateXpLevel(data.user.xp);
});

const xp_progress = computed(() => {
    return Math.trunc((xp_level.value % 1) * 100);
});
</script>

<template>
    <n-card class="h-full" size="small">
        <div class="flex flex-col justify-center items-center h-full">
            <n-flex :size="0" align="center" class="mb-5">
                <n-flex v-if="isNonNullish(data.user.playtime)" align="center" class="!gap-1">
                    <n-icon :component="ClockCircleOutlined" class="text-5" />
                    <n-text>{{ data.user.playtime }}</n-text>
                </n-flex>

                <n-divider vertical v-if="isNonNullish(data.user.playtime)" />

                <div class="flex flex-col justify-center items-center h-full">
                    <n-flex vertical>
                        <div class="text-center">
                            <n-text class="fw-bold">
                                {{ Math.trunc(xp_level) }} 级 ({{ new Intl.NumberFormat('zh-CN').format(xp_level) }} XP)
                            </n-text>
                        </div>

                        <div class="w-full mx-auto">
                            <n-progress
                                :percentage="xp_progress"
                                indicator-placement="inside"
                                indicator-text-color="white"
                            />
                        </div>
                    </n-flex>
                </div>
            </n-flex>

            <div v-if="isNonNullish(data.statistic)" class="text-center">
                <n-text :depth="3" class="text-sm">
                    <template v-if="isNonNullish(data.statistic.total) && isNonNullish(data.statistic.wins)">
                        胜率: {{ data.statistic.wins }} / {{ data.statistic.total }} ({{
                            ((data.statistic.wins / data.statistic.total) * 100).toFixed(2)
                        }}%)
                    </template>

                    <template v-else-if="isNonNullish(data.statistic.total)"
                        >游玩次数: {{ data.statistic.total }}</template
                    >

                    <template v-else-if="isNonNullish(data.statistic.wins)">胜场数: {{ data.statistic.wins }}</template>
                </n-text>
            </div>

            <div class="text-center" v-if="isNonNullish(data.user.join_at)">
                <n-text :depth="3" class="text-sm">
                    注册时间: {{ data.user.join_at.toLocaleString('zh-CN') }} ({{
                        formatDistanceToNow(data.user.join_at)
                    }}前)
                </n-text>
            </div>
        </div>
    </n-card>
</template>
