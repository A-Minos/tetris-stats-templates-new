<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core';
import { formatDistanceToNow } from 'date-fns';
import { partial } from 'lodash';
import { isNonNullish, isNullish } from 'remeda';
import type zenith from '~/types/zenith';
import { formatDateFns } from '~/utils/i18n';

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
                    {{
                        $t('v2.tetrio.user.info.quick_play_2.achieve_time', {
                            time: record.play_at.toLocaleString(locale),
                            when: formatDateFns(partial(formatDistanceToNow, record.play_at)).value,
                        })
                    }}
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
                    {{
                        $t('v2.tetrio.user.info.quick_play_2.highest', {
                            height: String(best.altitude).substring(0, String(best.altitude).lastIndexOf('.') + 2),
                            global_rank: best.global_rank,
                            time: best.play_at.toLocaleString(locale),
                            when: formatDateFns(partial(formatDistanceToNow, best.play_at)).value,
                        })
                    }}
                </n-text>
            </n-flex>
        </template>
    </n-card>
</template>
