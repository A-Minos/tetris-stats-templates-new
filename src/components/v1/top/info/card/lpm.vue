<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import { z } from 'zod';
import lpm from '~/assets/images/card/lpm.svg';
import { Trending } from '~/components/v1/trending/index.vue';
import { StatsCycle } from '~/constants/enum/v1/top/statsCycle';

const props = defineProps<{
    readonly data_type: StatsCycle;
}>();

const schema = z.object({
    lpm: z.number(),
    pps: z.number(),
    lpm_trending: z.nativeEnum(Trending).nullable(),
});

const data = useData(
    z
        .object({
            today: schema,
            historical: schema,
        })
        .readonly(),
);

const source = (() => {
    switch (props.data_type) {
        case StatsCycle.TODAY:
            return data.today;
        case StatsCycle.HISTORICAL:
            return data.historical;
    }
})();
</script>

<template>
    <div class="w-68.75 h-31.25 rounded-7.5 relative shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]">
        <img :src="lpm" class="absolute top-0 left-0" />

        <div class="absolute top-4.75 left-6">
            <span class="font-template text-6.25 fw-800 color-[#4d7d0f]">L’PM</span>
        </div>

        <div class="absolute bottom-4.25 left-6">
            <div class="flex items-center">
                <span class="font-template text-11.25 fw-500 color-[#4d7d0f]">{{ source.lpm }}</span>

                <v1-trending v-if="isNonNullish(source.lpm_trending)" :trending="source.lpm_trending" />
            </div>
        </div>

        <div class="absolute bottom-6.75 right-6">
            <span class="font-template text-right text-3.75 fw-500 color-[#4d7d0f]">{{ source.pps }} pps</span>
        </div>
    </div>
</template>
