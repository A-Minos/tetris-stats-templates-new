<script lang="ts" setup>
import { formatDistanceToNow } from 'date-fns';
import { isNonNullish } from 'remeda';
import { z } from 'zod';
import { confirmShow } from '~/utils/show';

const data = useData(
    z
        .object({
            user: z.object({
                country: z.string().nullable(),
            }),
            sprint: z
                .object({
                    time: z.string(),
                    global_rank: z.number().nullable(),
                    country_rank: z.number().nullable(),
                    play_at: z.coerce.date(),
                })
                .nullable(),
        })
        .readonly(),
);
</script>

<template>
    <n-card v-if="isNonNullish(data.sprint) && confirmShow()" size="small" title="40L">
        <n-flex align="center" justify="space-between">
            <n-flex :size="0" vertical>
                <n-text class="text-3xl fw-bold">{{ data.sprint.time }}</n-text>

                <n-text :depth="3" class="text-sm">
                    达成时间: {{ data.sprint.play_at.toLocaleString('zh-CN') }} ({{
                        formatDistanceToNow(data.sprint.play_at)
                    }}前)
                </n-text>
            </n-flex>

            <div class="text-right">
                <n-flex :size="0" vertical>
                    <template v-if="isNonNullish(data.sprint.global_rank)">
                        <n-text class="text-sm fw-bold" type="success"> #{{ data.sprint.global_rank }} </n-text>
                    </template>

                    <template v-if="isNonNullish(data.user.country) && isNonNullish(data.sprint.country_rank)">
                        <n-text class="text-sm fw-bold" type="info">
                            {{ data.user.country.toUpperCase() }}#{{ data.sprint.country_rank }}
                        </n-text>
                    </template>
                </n-flex>
            </div>
        </n-flex>
    </n-card>
</template>
