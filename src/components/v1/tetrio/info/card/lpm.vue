<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import lpm from '~/assets/images/card/lpm.svg';
import { Trending } from '~/components/v1/trending/index.vue';

const data = useData(
    z
        .object({
            multiplayer: z.object({
                lpm: z.number(),
                pps: z.number(),
                lpm_trending: z.nativeEnum(Trending),
            }),
        })
        .readonly(),
);

const valid = computed(() => {
    if (isNullish(data.multiplayer)) {
        return false;
    }

    return isNonNullish(data.multiplayer.lpm) && isNonNullish(data.multiplayer.pps);
});
</script>

<template>
    <template v-if="valid">
        <div class="w-68.75 h-31.25 rounded-7.5 relative shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]">
            <img :src="lpm" class="absolute top-0 left-0" />

            <div class="absolute top-4.75 left-6">
                <span class="font-template text-6.25 fw-800 color-[#4d7d0f]">L’PM</span>
            </div>

            <div class="absolute bottom-4.25 left-6">
                <div class="flex items-center">
                    <span class="font-template text-11.25 fw-500 color-[#4d7d0f]">
                        {{ data.multiplayer.lpm }}
                    </span>

                    <v1-trending
                        v-if="isNonNullish(data.multiplayer.lpm_trending)"
                        :trending="data.multiplayer.lpm_trending"
                    />
                </div>
            </div>

            <div class="absolute bottom-6.75 right-6">
                <span class="font-template text-right text-3.75 fw-500 color-[#4d7d0f]">
                    {{ data.multiplayer.pps }} pps
                </span>
            </div>
        </div>
    </template>
</template>
