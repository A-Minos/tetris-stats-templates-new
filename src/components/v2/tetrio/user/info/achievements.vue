<script lang="ts" setup>
import all from '~/assets/images/achievements/all.webp';
import diamond from '~/assets/images/achievements/diamond.webp';
import { z } from 'zod';

const data = useData(
    z
        .object({
            user: z.object({
                ar: z.number(),
                achievements: z.array(z.number()),
            }),
        })
        .readonly(),
);

const calculateAchievementStyle = (index: number) => {
    return {
        backgroundImage: `url(${all})`,
        backgroundSize: '800% 800%',
        backgroundPosition: `${Math.floor((index - 1) % 8) * -100}%${Math.floor((index - 1) / 8) * -100}%`,
    };
};
</script>

<template>
    <n-card size="small">
        <n-flex align="center" class="h-full" justify="center">
            <n-text class="text-4xl drop-shadow-[0_0_0.2rem_white] fw-bold">{{ data.user.ar }} AR</n-text>

            <template v-if="data.user.achievements.length > 0">
                <n-divider vertical />
            </template>

            <template v-for="achievement in data.user.achievements">
                <div class="relative size-20">
                    <div class="absolute top-0 left-0">
                        <n-image :img-props="{ class: 'size-20' }" :src="diamond" />
                    </div>

                    <div class="absolute top-1/2 left-1/2 -translate-1/2 filter-invert">
                        <div :style="calculateAchievementStyle(achievement)" class="size-10" />
                    </div>
                </div>
            </template>
        </n-flex>
    </n-card>
</template>
