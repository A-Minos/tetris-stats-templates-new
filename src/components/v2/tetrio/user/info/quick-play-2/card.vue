<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core';
import { formatDistanceToNow } from 'date-fns';
import { partial } from 'lodash';
import { isNonNullish, isNullish } from 'remeda';
import { formatDateFns } from '~/plugins/i18n';
import type zenith from '~/types/zenith';

const { locale } = useI18n();

const props = defineProps<{
    readonly country: string | null;

    readonly week: zenith['week'];

    readonly best: zenith['best'];

    readonly mods: string[];
}>();

const mod_icons = asyncComputed(async () => {
    return await Promise.all(
        props.mods.map(async (mod) => {
            return await import(`~/assets/images/mods/${mod}.webp?url`).then((module) => {
                return module.default;
            });
        }),
    );
}, []);

const record = computed(() => {
    if (isNonNullish(props.week)) {
        return props.week;
    }

    return props.best;
});
</script>

<template>
    <n-card :class="{ 'opacity-50': isNullish(week) && isNonNullish(best) }" size="small" title="Quick Play">
        <template #header-extra>
            <template v-for="mod_icon in mod_icons">
                <n-image :img-props="{ class: 'size-6' }" :src="mod_icon" class="opacity-50" />
            </template>
        </template>

        <n-flex
            v-if="record"
            :class="{ 'h-full': isNullish(week) || isNullish(best) }"
            align="center"
            justify="space-between"
        >
            <n-flex :size="0" vertical>
                <n-text class="text-3xl fw-bold">
                    {{ String(record.altitude).substring(0, String(record.altitude).lastIndexOf('.') + 2) }}m
                </n-text>

                <n-text :depth="3" class="text-sm">
                    达成时间: {{ record.play_at.toLocaleString(locale) }} ({{
                        formatDateFns(partial(formatDistanceToNow, record.play_at))
                    }}前)
                </n-text>
            </n-flex>

            <div class="text-right">
                <n-flex :size="0" vertical>
                    <template v-if="isNonNullish(record.global_rank)">
                        <n-text class="text-sm fw-bold" type="success"> #{{ record.global_rank }} </n-text>
                    </template>

                    <template v-if="isNonNullish(country) && isNonNullish(week)">
                        <n-text class="text-sm fw-bold" type="info">
                            {{ country?.toUpperCase() }}#{{ week.country_rank }}
                        </n-text>
                    </template>
                </n-flex>
            </div>
        </n-flex>

        <template v-if="isNonNullish(week) && isNonNullish(best)">
            <n-flex align="center" class="!gap-1">
                <n-text type="warning">
                    历史最高:
                    {{ String(best.altitude).substring(0, String(best.altitude).lastIndexOf('.') + 2) }}m (#{{
                        best.global_rank
                    }}) 在
                    {{ best.play_at.toLocaleString(locale) }}
                    ({{ formatDateFns(partial(formatDistanceToNow, best.play_at)) }}前)
                </n-text>
            </n-flex>
        </template>
    </n-card>
</template>
