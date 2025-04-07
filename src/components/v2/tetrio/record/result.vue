<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import GradeType from '~/constants/enum/v2/tetrio/grade-type';
import Statistic from '~/types/v2/tetrio/record/statistic';

const data = useData(
    z
        .object({
            type: z.nativeEnum(GradeType).nullable(),

            rank: z.number().nullable(),
            personal_rank: z.number().nullable(),

            play_at: z.coerce.date(),
        })
        .readonly(),
);

defineProps<{
    readonly title: string;
    readonly resultValue: string;
    readonly statistic: Statistic;
}>();

const type = computed(() => {
    if (isNullish(data.type)) {
        return 'default';
    }
    switch (data.type) {
        case GradeType.BEST:
        case GradeType.PERSONAL_BEST:
            return 'warning';
        case GradeType.RECENT:
            return 'info';
        case GradeType.DISPUTED:
            return 'error';
        default:
            return 'default';
    }
});

const is_best = computed(() => {
    return data.type === GradeType.BEST || (data.type === GradeType.PERSONAL_BEST && data.personal_rank === 1);
});
</script>

<template>
    <n-alert :show-icon="false" :title="title" :type="type">
        <n-flex vertical>
            <div class="text-(center 5xl) fw-bold">
                <n-text :class="{ 'text-(yellow shadow-[0_0_1rem])': is_best }">{{ resultValue }}</n-text>
            </div>

            <n-flex justify="center" size="small">
                <div v-if="isNonNullish(data.rank)" class="text-center text-3xl">
                    <n-text type="success">#{{ data.rank }}</n-text>
                </div>

                <div v-if="isNonNullish(data.personal_rank)" class="text-center text-3xl">
                    <n-text type="warning">PB#{{ data.personal_rank }}</n-text>
                </div>
            </n-flex>

            <div class="text-right">
                <n-text :depth="3">{{ data.play_at.toLocaleString('zh-CN') }}</n-text>
            </div>
        </n-flex>
    </n-alert>
</template>
