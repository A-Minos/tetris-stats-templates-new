<script lang="ts" setup>
import { formatDistanceToNow } from 'date-fns';
import { partial } from 'lodash';
import { isNonNullish } from 'remeda';
import { z } from 'zod';
import { formatDateFns } from '~/plugins/i18n';
import { confirmShow } from '~/utils/show';

const { locale } = useI18n();

const data = useData(
    z
        .object({
            user: z.object({
                country: z.string().nullable(),
            }),
            blitz: z
                .object({
                    score: z.number(),
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
    <n-card v-if="isNonNullish(data.blitz) && confirmShow()" size="small" title="Blitz">
        <n-flex align="center" justify="space-between">
            <n-flex :size="0" vertical>
                <n-text class="text-3xl fw-bold">
                    {{ new Intl.NumberFormat(locale).format(data.blitz.score) }}
                </n-text>

                <n-text :depth="3" class="text-sm">
                    达成时间: {{ data.blitz.play_at.toLocaleString(locale) }} ({{
                        formatDateFns(partial(formatDistanceToNow, data.blitz.play_at))
                    }}前)
                </n-text>
            </n-flex>

            <div class="text-right">
                <n-flex :size="0" vertical>
                    <template v-if="isNonNullish(data.blitz.global_rank)">
                        <n-text class="text-sm fw-bold" type="success"> #{{ data.blitz.global_rank }} </n-text>
                    </template>

                    <template v-if="isNonNullish(data.user.country) && isNonNullish(data.blitz.country_rank)">
                        <n-text class="text-sm fw-bold" type="info">
                            {{ data.user.country.toUpperCase() }}#{{ data.blitz.country_rank }}
                        </n-text>
                    </template>
                </n-flex>
            </div>
        </n-flex>
    </n-card>
</template>
