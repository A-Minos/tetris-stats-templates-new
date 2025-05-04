<script lang="ts" setup>
import { z } from 'zod';
import frameNone from '~/assets/images/achievements/frames/none.png';
import frameIssued from '~/assets/images/achievements/frames/issued.png';
import frameBronze from '~/assets/images/achievements/frames/bronze.png';
import frameSilver from '~/assets/images/achievements/frames/silver.png';
import frameGold from '~/assets/images/achievements/frames/gold.png';
import framePlatinum from '~/assets/images/achievements/frames/platinum.png';
import frameDiamond from '~/assets/images/achievements/frames/diamond.png';
import frameRingPiece from '~/assets/images/achievements/frames/ring-piece.png';
import icons0 from '~/assets/images/achievements/icons/0.png';
import icons874 from '~/assets/images/achievements/icons/874.png';

enum RankType {
    PERCENTILE = 1,
    ISSUE = 2,
    ZENITH = 3,
    PERCENTILELAX = 4,
    PERCENTILEVLAX = 5,
    PERCENTILEMLAX = 6,
}

enum ArType {
    UNRANKED = 0,
    RANKED = 1,
    COMPETITIVE = 2,
}

enum Rank {
    NONE = 0,
    BRONZE = 1,
    SILVER = 2,
    GOLD = 3,
    PLATINUM = 4,
    DIAMOND = 5,
    ISSUED = 100,
}

const data = useData(
    z
        .object({
            user: z.object({
                ar: z.number(),
                achievements: z.record(
                    z.number(),
                    z.object({
                        rank_type: z.nativeEnum(RankType),
                        ar_type: z.nativeEnum(ArType),
                        stub: z.boolean().nullable(),
                        rank: z.nativeEnum(Rank).nullable(),
                        achieved_score: z.number().nullable(),
                        pos: z.number().int().nullable(),
                    }),
                ),
            }),
        })
        .readonly(),
);

const calculateAchievementStyle = (index: number) => {
    index--;
    let iconSet = ({ '0': icons0, '874': icons874 })[index >> 6];
    return {
        backgroundImage: `url(${iconSet})`,
        backgroundSize: '800% 800%',
        backgroundPosition: `${index % 8 * -100}% ${(index % 64 >> 3) * -100}%`,
    };
};
</script>

<template>
    <n-card size="small">
        <n-flex align="center" class="h-full" justify="center">
            <n-text class="text-4xl drop-shadow-[0_0_0.2rem_white] fw-bold">{{ data.user.ar }} AR</n-text>

            <n-divider vertical v-if="data.user.achievements.length > 0" />

            <template v-for="achievement in data.user.achievements">
                <div class="relative size-20">
                    <div class="absolute top-0 left-0">
                        <n-image :img-props="{ class: 'size-20' }" :src="frameDiamond" />
                    </div>

                    <div class="absolute top-1/2 left-1/2 -translate-1/2 filter-invert">
                        <div :style="calculateAchievementStyle(achievement)" class="size-11" />
                    </div>
                </div>
            </template>
        </n-flex>
    </n-card>
</template>
