<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
const data = useData(
    z
        .object({
            singleplayer: z.object({
                '40l': z.string(),
            }),
        })
        .readonly(),
);

const valid = computed(() => {
    if (isNullish(data.singleplayer)) {
        return false;
    }

    return isNonNullish(data.singleplayer['40l']);
});
</script>

<template>
    <template v-if="valid">
        <div class="w-68.75 h-31.25 rounded-7.5 relative" style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026">
            <div class="absolute top-0 left-0">
                <svg fill="none" height="125" viewBox="0 0 275 125" width="275" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_2241_121)">
                        <rect fill="url(#paint0_linear_2241_121)" height="125" rx="30" width="275" />
                        <g style="mix-blend-mode: overlay">
                            <mask
                                id="mask0_2241_121"
                                height="195"
                                maskUnits="userSpaceOnUse"
                                style="mask-type: alpha"
                                width="195"
                                x="128"
                                y="-28"
                            >
                                <rect
                                    fill="url(#paint1_radial_2241_121)"
                                    height="158.811"
                                    transform="rotate(-15 128 13.1033)"
                                    width="158.811"
                                    x="128"
                                    y="13.1033"
                                />
                            </mask>
                            <g mask="url(#mask0_2241_121)">
                                <path
                                    d="M190.663 16.8646L187.238 4.08129L225.588 -6.19454L229.013 6.58877L190.663 16.8646ZM222.285 83.7475L235.069 80.3222L224.793 41.9723L212.009 45.3976L222.285 83.7475ZM242.378 133.168C234.495 135.28 226.657 135.755 218.864 134.591C211.075 133.422 203.871 130.927 197.252 127.105C190.634 123.284 184.871 118.293 179.964 112.132C175.06 105.965 171.552 98.94 169.439 91.0569C167.327 83.1739 166.853 75.3361 168.017 67.5435C169.186 59.754 171.681 52.55 175.502 45.9315C179.323 39.313 184.315 33.5522 190.478 28.6493C196.643 23.7409 203.667 20.2306 211.55 18.1183C218.155 16.3486 224.779 15.7155 231.422 16.2191C238.065 16.7226 244.592 18.2848 251.003 20.9056L257.554 9.55965L268.9 16.1103L262.349 27.4563C267.824 31.698 272.441 36.5694 276.198 42.0706C279.956 47.5718 282.719 53.6248 284.489 60.2295C286.601 68.1125 287.076 75.9503 285.912 83.7429C284.743 91.5324 282.248 98.7364 278.426 105.355C274.605 111.973 269.614 117.736 263.453 122.644C257.286 127.548 250.261 131.056 242.378 133.168ZM238.953 120.385C251.31 117.074 260.686 109.88 267.08 98.8043C273.475 87.7285 275.017 76.0119 271.706 63.6547C268.395 51.2975 261.201 41.9216 250.125 35.527C239.049 29.1323 227.333 27.5905 214.976 30.9016C202.619 34.2127 193.243 41.4062 186.848 52.4821C180.453 63.5579 178.912 75.2745 182.223 87.6317C185.534 99.9889 192.727 109.365 203.803 115.759C214.879 122.154 226.595 123.696 238.953 120.385Z"
                                    fill="#1C1B1F"
                                />
                            </g>
                        </g>
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_2241_121"
                            gradientUnits="userSpaceOnUse"
                            x1="50.5"
                            x2="244"
                            y1="-12"
                            y2="144.5"
                        >
                            <stop stop-color="#FFC7C7" />
                            <stop offset="1" stop-color="#FA9C9C" />
                        </linearGradient>
                        <radialGradient
                            id="paint1_radial_2241_121"
                            cx="0"
                            cy="0"
                            gradientTransform="translate(207.405 92.5088) rotate(90) scale(84.3683)"
                            gradientUnits="userSpaceOnUse"
                            r="1"
                        >
                            <stop offset="0.208333" stop-color="white" stop-opacity="0.78" />
                            <stop offset="1" stop-color="white" stop-opacity="0" />
                        </radialGradient>
                        <clipPath id="clip0_2241_121">
                            <rect fill="white" height="125" rx="30" width="275" />
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div class="absolute top-4.75 left-6">
                <span class="font-template text-6.25 fw-800 color-[#b42323]">40L</span>
            </div>

            <div class="absolute bottom-4.25 left-6">
                <span class="font-template text-11.25 fw-500 color-[#b42323]">
                    {{ data.singleplayer['40l'] }}
                </span>
            </div>
        </div>
    </template>
</template>
