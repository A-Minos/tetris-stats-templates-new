<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import Trending from '~/constants/enum/v1/trending';
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
        <div class="w-68.75 h-31.25 rounded-7.5 relative" style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026">
            <div class="absolute top-0 left-0">
                <svg fill="none" height="125" viewBox="0 0 275 125" width="275" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_2242_561)">
                        <rect fill="url(#paint0_linear_2242_561)" height="125" rx="30" width="275" />
                        <g style="mix-blend-mode: overlay">
                            <mask
                                id="mask0_2242_561"
                                height="154"
                                maskUnits="userSpaceOnUse"
                                style="mask-type: alpha"
                                width="154"
                                x="122"
                                y="-15"
                            >
                                <rect
                                    fill="url(#paint1_radial_2242_561)"
                                    height="125"
                                    transform="rotate(-15 122 18)"
                                    width="125"
                                    x="122"
                                    y="18"
                                />
                            </mask>
                            <g mask="url(#mask0_2242_561)">
                                <path
                                    clip-rule="evenodd"
                                    d="M190.033 96.8278L146.265 108.556L154.353 138.741L213.214 122.969L209.17 107.876L194.077 111.92L190.033 96.8278ZM275.093 106.388L231.325 118.116L223.237 87.9309L267.005 76.2032L275.093 106.388Z"
                                    fill="black"
                                    fill-rule="evenodd"
                                />
                                <rect
                                    fill="black"
                                    height="31.25"
                                    transform="rotate(-15 138.176 78.3704)"
                                    width="45.3125"
                                    x="138.176"
                                    y="78.3704"
                                />
                                <rect
                                    fill="black"
                                    height="31.25"
                                    transform="rotate(-15 215.148 57.7457)"
                                    width="45.3125"
                                    x="215.148"
                                    y="57.7457"
                                />
                                <rect
                                    fill="url(#paint2_linear_2242_561)"
                                    height="62.5"
                                    transform="rotate(-15 167.277 5.8678)"
                                    width="31.25"
                                    x="167.277"
                                    y="5.8678"
                                />
                                <rect
                                    fill="black"
                                    height="31.25"
                                    transform="rotate(-15 198.547 62.1942)"
                                    width="15.625"
                                    x="198.547"
                                    y="62.1942"
                                />
                                <rect
                                    fill="black"
                                    height="31.25"
                                    transform="rotate(-15 179.41 51.1456)"
                                    width="15.625"
                                    x="179.41"
                                    y="51.1456"
                                />
                            </g>
                        </g>
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_2242_561"
                            gradientUnits="userSpaceOnUse"
                            x1="50.5"
                            x2="244"
                            y1="-12"
                            y2="144.5"
                        >
                            <stop stop-color="#EBFFC7" />
                            <stop offset="1" stop-color="#D8FA9C" />
                        </linearGradient>
                        <radialGradient
                            id="paint1_radial_2242_561"
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
                            id="paint2_linear_2242_561"
                            gradientUnits="userSpaceOnUse"
                            x1="182.902"
                            x2="182.902"
                            y1="5.8678"
                            y2="68.3678"
                        >
                            <stop stop-opacity="0" />
                            <stop offset="1" stop-opacity="0.4" />
                        </linearGradient>
                        <clipPath id="clip0_2242_561">
                            <rect fill="white" height="125" rx="30" width="275" />
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div class="absolute top-4.75 left-6">
                <span class="font-template text-6.25 fw-800 color-[#4d7d0f]">L’PM</span>
            </div>

            <div class="absolute bottom-4.25 left-6">
                <div class="flex items-center">
                    <span class="font-template text-11.25 fw-500 color-[#4d7d0f]">
                        {{ data.multiplayer.lpm }}
                    </span>

                    <template v-if="isNonNullish(data.multiplayer.lpm_trending)">
                        <template v-if="data.multiplayer.lpm_trending === Trending.UP">
                            <v1-trending-up />
                        </template>

                        <template v-if="data.multiplayer.lpm_trending === Trending.DOWN">
                            <v1-trending-down />
                        </template>
                    </template>
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
