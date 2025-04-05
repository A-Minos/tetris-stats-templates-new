<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import { z } from 'zod';
import { Trending } from '~/components/v1/trending/index.vue';
import { StatsCycle } from '~/constants/enum/v1/top/statsCycle';

const props = defineProps<{
    readonly data_type: StatsCycle;
}>();

const schema = z.object({
    apm: z.number(),
    apl: z.number(),
    apm_trending: z.nativeEnum(Trending).nullable(),
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
    <div class="w-68.75 h-31.25 rounded-7.5 relative" style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026">
        <div class="absolute top-0 left-0">
            <svg fill="none" height="125" viewBox="0 0 275 125" width="275" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2242_529)">
                    <rect fill="url(#paint0_linear_2242_529)" height="125" rx="30" width="275" />
                    <g opacity="0.8" style="mix-blend-mode: overlay">
                        <mask
                            id="mask0_2242_529"
                            height="154"
                            maskUnits="userSpaceOnUse"
                            style="mask-type: alpha"
                            width="154"
                            x="122"
                            y="-15"
                        >
                            <rect
                                fill="url(#paint1_radial_2242_529)"
                                height="125"
                                transform="rotate(-15 122 18)"
                                width="125"
                                x="122"
                                y="18"
                            />
                        </mask>
                        <g mask="url(#mask0_2242_529)">
                            <rect
                                fill="black"
                                height="31.25"
                                transform="rotate(-15 178.356 10.9877)"
                                width="31.25"
                                x="178.356"
                                y="10.9877"
                            />
                            <rect
                                fill="black"
                                height="31.25"
                                transform="rotate(-15 217.142 41.0355)"
                                width="31.25"
                                x="217.142"
                                y="41.0355"
                            />
                            <rect
                                fill="black"
                                height="31.25"
                                transform="rotate(-15 181.974 90.899)"
                                width="31.25"
                                x="181.974"
                                y="90.899"
                            />
                            <rect
                                fill="url(#paint2_linear_2242_529)"
                                height="31.25"
                                transform="rotate(-15 124.022 25.5463)"
                                width="56.25"
                                x="124.022"
                                y="25.5463"
                            />
                            <rect
                                fill="url(#paint3_linear_2242_529)"
                                height="31.25"
                                transform="rotate(-15 144.243 101.009)"
                                width="39.0625"
                                x="144.243"
                                y="101.009"
                            />
                            <rect
                                fill="url(#paint4_linear_2242_529)"
                                height="31.25"
                                transform="rotate(-15 134.133 63.2777)"
                                width="85.9375"
                                x="134.133"
                                y="63.2777"
                            />
                        </g>
                    </g>
                </g>
                <defs>
                    <linearGradient
                        id="paint0_linear_2242_529"
                        gradientUnits="userSpaceOnUse"
                        x1="50.5"
                        x2="244"
                        y1="-12"
                        y2="144.5"
                    >
                        <stop stop-color="#FFEAC7" />
                        <stop offset="1" stop-color="#FACF9C" />
                    </linearGradient>
                    <radialGradient
                        id="paint1_radial_2242_529"
                        cx="0"
                        cy="0"
                        gradientTransform="translate(184.5 80.5) rotate(90) scale(66.4062)"
                        gradientUnits="userSpaceOnUse"
                        r="1"
                    >
                        <stop offset="0.208333" stop-color="white" />
                        <stop offset="1" stop-color="white" stop-opacity="0" />
                    </radialGradient>
                    <linearGradient
                        id="paint2_linear_2242_529"
                        gradientUnits="userSpaceOnUse"
                        x1="124.022"
                        x2="180.272"
                        y1="25.5463"
                        y2="25.5463"
                    >
                        <stop stop-opacity="0" />
                        <stop offset="1" stop-opacity="0.4" />
                    </linearGradient>
                    <linearGradient
                        id="paint3_linear_2242_529"
                        gradientUnits="userSpaceOnUse"
                        x1="144.243"
                        x2="183.305"
                        y1="101.009"
                        y2="101.009"
                    >
                        <stop stop-opacity="0" />
                        <stop offset="1" stop-opacity="0.4" />
                    </linearGradient>
                    <linearGradient
                        id="paint4_linear_2242_529"
                        gradientUnits="userSpaceOnUse"
                        x1="134.133"
                        x2="220.07"
                        y1="63.2777"
                        y2="63.2777"
                    >
                        <stop stop-opacity="0" />
                        <stop offset="1" stop-opacity="0.4" />
                    </linearGradient>
                    <clipPath id="clip0_2242_529">
                        <rect fill="white" height="125" rx="30" width="275" />
                    </clipPath>
                </defs>
            </svg>
        </div>

        <div class="absolute top-4.75 left-6">
            <span class="font-template text-6.25 fw-800 color-[#b5530a]">APM</span>
        </div>

        <div class="absolute bottom-4.25 left-6">
            <div class="flex items-center">
                <span class="font-template text-11.25 fw-500 color-[#b5530a]">{{ source.apm }}</span>

                <v1-trending v-if="isNonNullish(source.apm_trending)" :trending="source.apm_trending" />
            </div>
        </div>

        <div class="absolute bottom-6.75 right-6">
            <span class="font-template text-right text-3.75 fw-500 color-[#b5530a]">x{{ source.apl }}</span>
        </div>
    </div>
</template>
