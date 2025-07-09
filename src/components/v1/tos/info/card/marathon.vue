<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import marathon from '~/assets/images/card/marathon.svg';

const data = useData(
    z
        .object({
            singleplayer: z.object({
                marathon: z.string(),
            }),
        })
        .readonly(),
);

const valid = computed(() => {
    if (isNullish(data.singleplayer)) {
        return false;
    }

    return isNonNullish(data.singleplayer.marathon);
});
</script>

<template>
    <template v-if="valid">
        <div class="w-68.75 h-31.25 rounded-7.5 relative shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]">
            <img :src="marathon" class="absolute top-0 left-0" />

            <div class="absolute top-4.75 left-6">
                <span class="font-template text-6.25 fw-800 color-[#075a86]">Marathon</span>
            </div>

            <div class="absolute bottom-4.25 left-6">
                <span class="font-template text-11.25 fw-500 color-[#075a86]">
                    {{ data.singleplayer.marathon }}
                </span>
            </div>
        </div>
    </template>
</template>
