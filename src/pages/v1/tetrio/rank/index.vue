<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core';
import { isNonNullish } from 'remeda';
import { z } from 'zod';
import { Rank, ValidRank } from '~/types/rank';

const data = useData(
    z
        .object({
            items: z.partialRecord(
                ValidRank,
                z.object({
                    trending: z.number(),
                    require_tr: z.number(),
                    players: z.number(),
                }),
            ),
            updated_at: z.coerce.date(),
        })
        .readonly(),
);

const colorMappings: Record<
    Rank,
    {
        readonly background: string;
        readonly text: string;
    }
> = {
    'x+': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #D946EF 0%, #F5CFFE 100%)',
        text: '#8E23B4CC',
    },
    x: {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #D946EF 0%, #F5CFFE 100%)',
        text: '#8E23B4CC',
    },
    u: {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #F04444 0%, #FECBCA 100%)',
        text: '#7F1D1CCC',
    },
    ss: {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #E9B308 0%, #FEF18B 100%)',
        text: '#723F12CC',
    },
    's+': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #E9B308 0%, #FEF18B 100%)',
        text: '#723F12CC',
    },
    s: {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #E9B308 0%, #FEF18B 100%)',
        text: '#723F12CC',
    },
    's-': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #E9B308 0%, #FEF18B 100%)',
        text: '#723F12CC',
    },
    'a+': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #23C55E 0%, #BBF7D1 100%)',
        text: '#15532ECC',
    },
    a: {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #23C55E 0%, #BBF7D1 100%)',
        text: '#15532ECC',
    },
    'a-': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #23C55E 0%, #BBF7D1 100%)',
        text: '#15532ECC',
    },
    'b+': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #3B82F6 0%, #BFDCFE 100%)',
        text: '#1F3A8B',
    },
    b: {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #3B82F6 0%, #BFDCFE 100%)',
        text: '#1F3A8B',
    },
    'b-': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #3B82F6 0%, #BFDCFE 100%)',
        text: '#1F3A8B',
    },
    'c+': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #A755F7 0%, #EAD5FF 100%)',
        text: '#571C86',
    },
    c: {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #A755F7 0%, #EAD5FF 100%)',
        text: '#571C86',
    },
    'c-': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #A755F7 0%, #EAD5FF 100%)',
        text: '#571C86',
    },
    'd+': {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #64748B 0%, #E1E8F0 100%)',
        text: '#0F172A',
    },
    d: {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #64748B 0%, #E1E8F0 100%)',
        text: '#0F172A',
    },
    z: {
        background: 'radial-gradient(95.42% 572.5% at 4.58% 17.5%, #737373 0%, #E5E5E5 100%)',
        text: '#171717',
    },
};

const rankImageMap = asyncComputed(async () => {
    return Object.fromEntries(
        await Promise.all(
            Object.keys(data.items).map(async (rank) => {
                const name = rank.toLowerCase();

                return [
                    rank,
                    await import(`~/assets/images/rank/${name}.svg?url`).then((module) => {
                        return module.default;
                    }),
                ];
            }),
        ),
    );
}, {});

useLang();
</script>

<template>
    <div id="content" class="w-fit p-6.25 bg-[#f1f1f1]">
        <span class="font-template text-8.75 font-black">Rankings</span>

        <div class="flex flex-col gap-2.5">
            <div
                v-for="(rank, name) in data.items"
                :style="{ backgroundImage: colorMappings[name].background }"
                class="w-150 h-25 rounded-7.5 relative shadow-[0_1.25rem_3rem_0_#00000026]"
            >
                <div v-if="rank !== undefined" class="p-6.25 flex gap-21.25 items-center">
                    <div>
                        <img
                            v-if="isNonNullish(rankImageMap[name])"
                            :alt="name"
                            :src="rankImageMap[name]"
                            class="w-12.5 h-12.5"
                        />
                    </div>

                    <div :style="{ color: colorMappings[name].text }" class="font-template w-25 text-8 font-bold">
                        {{ rank.trending > 0 ? '↑' : rank.trending < 0 ? '↓' : '→' }}{{ Math.abs(rank.trending) }}
                    </div>

                    <div
                        :style="{ color: colorMappings[name].text }"
                        class="w-57.5 text-right leading-none absolute right-6.25"
                    >
                        <span class="font-template font-extrabold text-11.25">{{ rank.require_tr }}</span>
                        <br />
                        <span class="font-template text-7.5">{{ rank.players }} players</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="font-template w-150 h-12.5 font-bold text-7.5 flex flex-col justify-center items-center">
            Updated on {{ data.updated_at.toLocaleString('zh-CN') }}
        </div>
    </div>
</template>

<style lang="scss">
@use '~/styles/v1';
</style>
