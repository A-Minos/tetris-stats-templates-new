<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import challenge from '~/assets/images/card/challenge.svg';

const data = useData(
    z
        .object({
            singleplayer: z.object({
                challenge: z.string(),
            }),
        })
        .readonly(),
);

const valid = computed(() => {
    if (isNullish(data.singleplayer)) {
        return false;
    }

    return isNonNullish(data.singleplayer.challenge);
});
</script>

<template>
    <template v-if="valid">
        <div class="w-68.75 h-31.25 rounded-7.5 relative shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]">
            <img :src="challenge" class="absolute top-0 left-0" />

            <div class="absolute top-4.75 left-6">
                <span class="font-template text-6.25 fw-800 color-[#8e23b4]">Challenge</span>
            </div>

            <div class="absolute bottom-4.25 left-6">
                <span class="font-template text-11.25 fw-500 color-[#8e23b4]">
                    {{ data.singleplayer.challenge }}
                </span>
            </div>
        </div>
    </template>
</template>
