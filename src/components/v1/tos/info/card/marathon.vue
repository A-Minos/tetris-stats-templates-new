<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
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
        <div class="w-68.75 h-31.25 rounded-7.5 relative" style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026">
            <div class="absolute top-0 left-0">
                <svg fill="none" height="125" viewBox="0 0 275 125" width="275" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_2242_273)">
                        <rect fill="url(#paint0_linear_2242_273)" height="125" rx="30" width="275" />
                        <g opacity="0.5" style="mix-blend-mode: overlay">
                            <mask
                                id="mask0_2242_273"
                                height="178"
                                maskUnits="userSpaceOnUse"
                                style="mask-type: alpha"
                                width="177"
                                x="147"
                                y="-27"
                            >
                                <rect
                                    fill="url(#paint1_radial_2242_273)"
                                    height="144.298"
                                    transform="rotate(-15 147 11)"
                                    width="144.298"
                                    x="147"
                                    y="11"
                                />
                            </mask>
                            <g mask="url(#mask0_2242_273)">
                                <path
                                    d="M258.29 124.345L248.953 89.4991L233.645 81.1519L234.685 108.261L192.434 110.868L191.645 98.6304L221.077 96.9686L217.765 47.4375L208.4 54.3038L213.691 74.0495L202.076 77.1618L194.762 49.8663L215.057 33.8467C218.055 31.487 220.295 29.8755 221.775 29.012C223.256 28.1485 224.673 27.5352 226.028 27.1721C228.061 26.6274 230.091 26.654 232.119 27.2519C234.146 27.8498 235.926 28.8772 237.457 30.3342L245.755 38.0702C249.361 41.4611 253.667 43.8863 258.675 45.3455C263.683 46.8048 268.945 46.7953 274.462 45.317L277.574 56.9321C271.186 58.6438 264.852 58.9144 258.574 57.7439C252.295 56.5734 246.684 54.3161 241.742 50.9719L242.926 69.3283L258.234 77.6755L269.905 121.232L258.29 124.345ZM233.962 21.9341C230.768 22.79 227.728 22.3853 224.844 20.7202C221.96 19.055 220.09 16.6254 219.234 13.4312C218.378 10.2371 218.783 7.19792 220.448 4.31381C222.113 1.42969 224.543 -0.4403 227.737 -1.29617C230.931 -2.15205 233.971 -1.74741 236.855 -0.0822658C239.739 1.58288 241.609 4.01253 242.465 7.20669C243.32 10.4009 242.916 13.44 241.251 16.3241C239.586 19.2082 237.156 21.0782 233.962 21.9341Z"
                                    fill="#1C1B1F"
                                />
                            </g>
                        </g>
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_2242_273"
                            gradientUnits="userSpaceOnUse"
                            x1="50.5"
                            x2="244"
                            y1="-12"
                            y2="144.5"
                        >
                            <stop stop-color="#B9E6FD" />
                            <stop offset="1" stop-color="#7ED3FC" />
                        </linearGradient>
                        <radialGradient
                            id="paint1_radial_2242_273"
                            cx="0"
                            cy="0"
                            gradientTransform="translate(219.149 83.1492) rotate(90) scale(76.6585)"
                            gradientUnits="userSpaceOnUse"
                            r="1"
                        >
                            <stop offset="0.208333" stop-color="white" stop-opacity="0.78" />
                            <stop offset="1" stop-color="white" stop-opacity="0" />
                        </radialGradient>
                        <clipPath id="clip0_2242_273">
                            <rect fill="white" height="125" rx="30" width="275" />
                        </clipPath>
                    </defs>
                </svg>
            </div>

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
