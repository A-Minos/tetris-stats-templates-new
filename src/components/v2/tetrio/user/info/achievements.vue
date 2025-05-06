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
import wreathT3 from '~/assets/images/achievements/wreaths/t3.png';
import wreathT5 from '~/assets/images/achievements/wreaths/t5.png';
import wreathT10 from '~/assets/images/achievements/wreaths/t10.png';
import wreathT25 from '~/assets/images/achievements/wreaths/t25.png';
import wreathT50 from '~/assets/images/achievements/wreaths/t50.png';
import wreathT100 from '~/assets/images/achievements/wreaths/t100.png';

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
                achievements: z.array(
                    z.object({
                        key: z.number().int(),
                        rank_type: z.nativeEnum(RankType),
                        ar_type: z.nativeEnum(ArType),
                        stub: z.boolean().optional(),
                        rank: z.nativeEnum(Rank).nullable(),
                        achieved_score: z.number().nullable(),
                        pos: z.number().int().nullable(),
                        progress: z.number().nullable(),
                        total: z.number().int().nullable(),
                    }),
                ),
            }),
        })
        .readonly(),
);


const CUTOFFS = {		//	Data from ch.tetr.io/res/js/achievements.js
    [RankType.PERCENTILE]: {
        [Rank.NONE]: [0.70, 1.00, 0, 1],
        [Rank.BRONZE]: [0.50, 0.70, 50, 69],
        [Rank.SILVER]: [0.30, 0.50, 30, 49],
        [Rank.GOLD]: [0.10, 0.30, 10, 29],
        [Rank.PLATINUM]: [0.05, 0.10, 5, 9],
        [Rank.DIAMOND]: [0.00, 0.05, 0, 4]
    }, [RankType.ZENITH]: {
        [Rank.NONE]: [0, 150],
        [Rank.BRONZE]: [150, 450],
        [Rank.SILVER]: [450, 850],
        [Rank.GOLD]: [850, 1350],
        [Rank.PLATINUM]: [1350, 1650],
        [Rank.DIAMOND]: [0, 1]
    }, [RankType.PERCENTILELAX]: {
        [Rank.NONE]: [1.00, 1.00, 100, Infinity],
        [Rank.BRONZE]: [1.00, 1.00, 100, Infinity],
        [Rank.SILVER]: [0.60, 1.00, 60, 99],
        [Rank.GOLD]: [0.20, 0.60, 20, 59],
        [Rank.PLATINUM]: [0.05, 0.20, 5, 19],
        [Rank.DIAMOND]: [0.00, 0.05, 0, 4]
    }, [RankType.PERCENTILEVLAX]: {
        [Rank.NONE]: [1.00, 1.00, 10, Infinity],
        [Rank.BRONZE]: [1.00, 1.00, 10, Infinity],
        [Rank.SILVER]: [1.00, 1.00, 10, Infinity],
        [Rank.GOLD]: [0.50, 1.00, 5, 9],
        [Rank.PLATINUM]: [0.20, 0.50, 2, 4],
        [Rank.DIAMOND]: [0.00, 0.20, 0, 1]
    }, [RankType.PERCENTILEMLAX]: {
        [Rank.NONE]: [1.00, 1.00, 100, Infinity],
        [Rank.BRONZE]: [1.00, 1.00, 100, Infinity],
        [Rank.SILVER]: [0.50, 1.00, 50, 99],
        [Rank.GOLD]: [0.20, 0.50, 20, 49],
        [Rank.PLATINUM]: [0.10, 0.20, 10, 19],
        [Rank.DIAMOND]: [0.00, 0.10, 0, 9]
    }
};

function calcFrame(a) {
    return {
        [Rank.NONE]: frameNone,
        [Rank.BRONZE]: frameBronze,
        [Rank.SILVER]: frameSilver,
        [Rank.GOLD]: frameGold,
        [Rank.PLATINUM]: framePlatinum,
        [Rank.DIAMOND]: frameDiamond,
        [Rank.ISSUED]: frameIssued
    }[a.stub ? 0 : a.rank];
}
function calcIcon(a) {
    let id = a.key - 1;
    return {
        img: { '0': icons0, '874': icons874 }[id >> 6],
        pos: [id & 7, id >> 3 & 7]
    };
}
function calcWreath(a) {
    return !a.stub && a.pos > -1 && a.ar_type === ArType.COMPETITIVE
        ? [wreathT3, wreathT5, wreathT10, wreathT25, wreathT50, wreathT100, null]
        [[3, 5, 10, 25, 50, 100].filter(e => a.pos >= e).length]
        : null;
}
function calcProgress(a) {
    let prog = 0;
    if (!a.stub && a.pos > -1) {
        if ([
            RankType.PERCENTILE, RankType.PERCENTILELAX,
            RankType.PERCENTILEVLAX, RankType.PERCENTILEMLAX
        ].includes(a.rank_type)) {
            let perc = a.pos / Math.max(1, a.total - 1),
                cut = CUTOFFS[a.rank_type][a.rank],
                ppos = 1 - (perc - cut[0]) / (cut[1] - cut[0]),
                cpos = 1 - (a.pos - cut[2]) / (cut[3] - cut[2]);
            prog = Math.max(ppos, cpos);
        } else if (RankType.ZENITH == a.rank_type) {
            let cut = CUTOFFS[a.rank_type][a.rank];
            prog = (a.achieved_score - cut[0]) / (cut[1] - cut[0]);
        }
    }
    if (!a.stub && a.progress !== -1)
        prog = a.progress;
    return prog;
}

function calcProgressClip(p) {	//	Code from ch.tetr.io/res/js/achievements.js
    const n = 21.0907499842, v = 100 - 2 * n, o = 107.756034934;
    if (p <= 1 / 3) {
        const px = 3 * p;
        return `polygon(${n}% 0, ${n + px * v}% 0, 50% 50%)`;
    } else if (p <= 2 / 3) {
        const px = 3 * p - 1;
        return `polygon(${n}% 0, ${n + v}% 0, ${n + v + px * (o - (n + v))}% ${50 * px}%, 50% 50%)`;
    } else if (p <= 1) {
        const px = 3 * p - 2;
        return `polygon(${n}% 0, ${n + v}% 0, ${o}% 50%, ${n + v + (1 - px) * (o - (n + v))}% ${50 + 50 * px}%, 50% 50%)`;
    }
    return 'none';
}

function createAchievement(a) {
    if (!a)
        return `<img class="absolute top-0 left-0 size-20" src="${frameNone}" />`;
    console.log(a);
    let frame = calcFrame(a), icon = calcIcon(a), invert = 'filter-invert',
        wreath = calcWreath(a), progress = calcProgress(a);
    if (!a.stub && a.rank === Rank.NONE)
        invert += '-70';
    return `<img class="absolute top-0 left-0 size-20" src="${frame}" />`
        + (progress ? `<div class="absolute top-0 left-0 size-20">
				<img class="absolute top-0 left-0 size-20" src="${frameRingPiece}" style="clip-path: ${calcProgressClip(progress)};" />
				<img class="absolute top-0 left-0 size-20" src="${frameRingPiece}" style="clip-path: ${calcProgressClip(progress)}; transform: rotate(0.5turn);" />
			</div>` : '')
        + (wreath ? `<img class="absolute top-0 left-0 size-20" src="${wreath}" />` : '')
        + `<div class="absolute top-1/2 left-1/2 -translate-1/2 ${invert}">
				<div class="size-11" style="background-image: url(${icon.img}); background-size: 800% 800%; background-position: -${icon.pos[0]}00% -${icon.pos[1]}00%;"></div>
			</div>`;
}
</script>

<template>
    <n-card size="small">
        <n-flex align="center" class="h-full" justify="center">
            <n-text class="text-4xl drop-shadow-[0_0_0.2rem_white] fw-bold">{{ data.user.ar }} AR</n-text>

            <n-divider vertical v-if="data.user.achievements.length > 0" />

            <template v-for="achievement in data.user.achievements">
                <div class="relative size-20" v-html="createAchievement(achievement)"></div>
            </template>
        </n-flex>
    </n-card>
</template>
