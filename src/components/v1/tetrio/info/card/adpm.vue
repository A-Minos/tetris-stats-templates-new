<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import adpm from '~/assets/images/card/adpm.svg';
import { Trending } from '~/components/v1/trending/index.vue';

const data = useData(
    z
        .object({
            multiplayer: z.object({
                adpm: z.number(),
                vs: z.number(),
                adpl: z.number(),
                adpm_trending: z.nativeEnum(Trending),
            }),
        })
        .readonly(),
);

const valid = computed(() => {
    if (isNullish(data.multiplayer)) {
        return false;
    }

    return (
        isNonNullish(data.multiplayer.adpm) && isNonNullish(data.multiplayer.vs) && isNonNullish(data.multiplayer.adpl)
    );
});
</script>

<template>
    <template v-if="valid">
        <div class="w-68.75 h-31.25 rounded-7.5 relative shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]]">
            <img :src="adpm" class="absolute top-0 left-0" />

            <div class="absolute top-4.75 left-6">
                <span class="font-template text-6.25 fw-800 color-[#235db4]">ADPM</span>
            </div>

            <div class="absolute bottom-4.25 left-6">
                <div class="flex items-center">
                    <span class="font-template text-11.25 fw-500 color-[#235db4]">
                        {{ data.multiplayer.adpm }}
                    </span>

                    <v1-trending
                        v-if="isNonNullish(data.multiplayer.adpm_trending)"
                        :trending="data.multiplayer.adpm_trending"
                    />
                </div>
            </div>

            <div class="absolute bottom-11 right-6.75">
                <span class="font-template text-right text-3.75 fw-500 color-[#235db4]">
                    {{ data.multiplayer.vs }} vs
                </span>
            </div>

            <div class="absolute bottom-6.75 right-6.75">
                <span class="font-template text-right text-3.75 fw-500 color-[#235db4]">
                    x{{ data.multiplayer.adpl }}
                </span>
            </div>
        </div>
    </template>
</template>
