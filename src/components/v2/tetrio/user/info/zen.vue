<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import { confirmShow } from '~/utils/show';

const { locale } = useI18n();

const data = useData(
    z
        .object({
            zen: z
                .object({
                    score: z.number(),
                    level: z.number(),
                })
                .nullable(),
        })
        .readonly(),
);

const symbols = computed(() => {
    if (isNullish(data.zen)) {
        throw new Error('Zen data is not nullish');
    }

    let result = '';

    const mapping: Record<number, string> = {
        500000: 'ǰ',
        400000: 'ǯǰ',
        100000: 'ǯ',
        90000: 'ǭǯ',
        50000: 'Ǯ',
        40000: 'ǭǮ',
        10000: 'ǭ',
        9000: 'ǫǭ',
        5000: 'Ǭ',
        4000: 'ǫǬ',
        1000: 'ǫ',
        900: 'ǩǫ',
        500: 'Ǫ',
        400: 'ǩǪ',
        100: 'ǩ',
        90: 'ǧǩ',
        50: 'Ǩ',
        40: 'ǧǨ',
        10: 'ǧ',
        9: 'ǥǧ',
        5: 'Ǧ',
        4: 'ǥǦ',
        1: 'ǥ',
    };

    const keys = Object.keys(mapping);

    let level = Math.max(Math.floor(data.zen.level), 0);

    while (level >= 1) {
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = Number(keys[i]);

            if (level / key >= 1) {
                result += mapping[key];
                level -= key;
                break;
            }
        }
    }

    return result;
});
</script>

<template>
    <n-card v-if="isNonNullish(data.zen) && confirmShow()" size="small" title="Zen">
        <n-flex align="center" justify="space-between">
            <n-flex :size="0" align="start" vertical>
                <n-text class="text-3xl fw-bold">{{ new Intl.NumberFormat(locale).format(data.zen.score) }}</n-text>
                <n-text :depth="3" class="text-xl fw-bold">Level {{ data.zen.level }}</n-text>
            </n-flex>

            <n-text :depth="3" class="text-4xl font-[HUN] tracking-0.1">
                {{ symbols }}
            </n-text>
        </n-flex>
    </n-card>
</template>
