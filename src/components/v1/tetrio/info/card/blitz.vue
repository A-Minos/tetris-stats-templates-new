<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
const data = useData(
    z
        .object({
            singleplayer: z.object({
                blitz: z.string(),
            }),
        })
        .readonly(),
);

const valid = computed(() => {
    if (isNullish(data.singleplayer)) {
        return false;
    }

    return isNonNullish(data.singleplayer.blitz);
});
</script>

<template>
    <template v-if="valid">
        <div class="w-68.75 h-31.25 rounded-7.5 relative" style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026">
            <div class="absolute top-0 left-0">
                <svg fill="none" height="125" viewBox="0 0 275 125" width="275" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_2252_1148)">
                        <rect fill="url(#paint0_linear_2252_1148)" height="125" rx="30" width="275" />
                        <g opacity="0.5" style="mix-blend-mode: overlay">
                            <mask
                                id="mask0_2252_1148"
                                height="225"
                                maskUnits="userSpaceOnUse"
                                style="mask-type: alpha"
                                width="225"
                                x="120"
                                y="-47"
                            >
                                <rect
                                    fill="url(#paint1_radial_2252_1148)"
                                    height="183.584"
                                    transform="rotate(-15 120 0.515015)"
                                    width="183.584"
                                    x="120"
                                    y="0.515015"
                                />
                            </mask>
                            <g mask="url(#mask0_2252_1148)">
                                <path
                                    d="M235.463 135.879L228.993 82.1788L203.133 89.1081C201.286 89.6031 200.013 89.416 199.316 88.547C198.623 87.6767 198.539 86.2475 199.062 84.2595L221.993 -3.0564L229.382 -5.03619L235.851 48.6645L261.712 41.7352C263.559 41.2402 264.829 41.4279 265.521 42.2983C266.219 43.1673 266.306 44.5958 265.783 46.5838L242.852 133.9L235.463 135.879Z"
                                    fill="#1C1B1F"
                                />
                            </g>
                        </g>
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_2252_1148"
                            gradientUnits="userSpaceOnUse"
                            x1="50.5"
                            x2="244"
                            y1="-12"
                            y2="144.5"
                        >
                            <stop stop-color="#EAC7FF" />
                            <stop offset="1" stop-color="#D19CFA" />
                        </linearGradient>
                        <radialGradient
                            id="paint1_radial_2252_1148"
                            cx="0"
                            cy="0"
                            gradientTransform="translate(211.792 92.3071) rotate(90) scale(97.5291)"
                            gradientUnits="userSpaceOnUse"
                            r="1"
                        >
                            <stop offset="0.208333" stop-color="white" stop-opacity="0.78" />
                            <stop offset="1" stop-color="white" stop-opacity="0" />
                        </radialGradient>
                        <clipPath id="clip0_2252_1148">
                            <rect fill="white" height="125" rx="30" width="275" />
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div class="absolute top-4.75 left-6">
                <span class="font-template text-6.25 fw-800 color-[#8e23b4]">Blitz</span>
            </div>

            <div class="absolute bottom-4.25 left-6">
                <span class="font-template text-11.25 fw-500 color-[#8e23b4]">
                    {{ data.singleplayer.blitz }}
                </span>
            </div>
        </div>
    </template>
</template>
