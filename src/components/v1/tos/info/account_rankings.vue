<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';

const data = useData<{
    readonly user: {
        readonly avatar: string;
        readonly name: string;
    };
}>();

const valid = computed(() => {
    if (isNullish(data.user)) {
        return false;
    }

    return isNonNullish(data.user.avatar) && isNonNullish(data.user.name);
});

const chart_container = ref<HTMLDivElement>();
const chart_valid = ref(true);

onMounted(async () => {
    await nextTick(() => {
        chart_valid.value = isNonNullish(chart_container.value) && chart_container.value.childElementCount > 0;
    });
});
</script>

<template>
    <template v-if="valid">
        <i18n-t
            :keypath="`v1.tos.info.account.title`"
            tag="span"
            class="font-template text-8.75 fw-900 color-[#000000]"
        ></i18n-t>

        <div class="mt-2.75">
            <div class="flex gap-6.25">
                <div class="size-68.75 rounded-7.5 bg-[#fafafa]" style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026">
                    <div class="size-full px-15.5 py-7.5 box-border">
                        <div class="flex flex-col items-center gap-7">
                            <img :src="data.user.avatar" alt="user.avatar" class="size-31.25 rounded-full" />
                            <span class="font-template text-7.5 fw-800 text-[#000000]">{{ data.user.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="size-68.75 rounded-7.5 bg-[#fafafa]" style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026">
                    <div class="size-full px-6.25 py-10 box-border">
                        <div class="flex flex-col gap-8.75 items-center">
                            <div class="size-31.25">
                                <svg
                                    fill="none"
                                    height="125"
                                    viewBox="0 0 125 125"
                                    width="125"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                >
                                    <rect fill="url(#pattern0_2242_235)" height="125" rx="62.5" width="125" />
                                    <rect fill="#1D1916" height="125" rx="62.5" width="125" />
                                    <g filter="url(#filter0_d_2242_235)">
                                        <rect
                                            fill="#A5F3FD"
                                            height="34.5394"
                                            rx="2"
                                            transform="rotate(45 61.7178 10.1713)"
                                            width="34.5395"
                                            x="61.7178"
                                            y="10.1713"
                                        />
                                        <rect
                                            fill="#FEF18B"
                                            height="34.5394"
                                            rx="2"
                                            transform="rotate(45 34.585 37.3075)"
                                            width="34.5395"
                                            x="34.585"
                                            y="37.3075"
                                        />
                                        <rect
                                            fill="#FEF18B"
                                            height="34.5394"
                                            rx="2"
                                            transform="rotate(45 88.8516 37.3075)"
                                            width="34.5395"
                                            x="88.8516"
                                            y="37.3075"
                                        />
                                        <rect
                                            fill="#A5F3FD"
                                            height="34.5394"
                                            rx="2"
                                            transform="rotate(45 61.7178 64.4452)"
                                            width="34.5395"
                                            x="61.7178"
                                            y="64.4452"
                                        />
                                    </g>
                                    <defs>
                                        <pattern
                                            id="pattern0_2242_235"
                                            height="1"
                                            patternContentUnits="objectBoundingBox"
                                            width="1"
                                        >
                                            <use transform="scale(0.00121359)" xlink:href="#image0_2242_235" />
                                        </pattern>
                                        <filter
                                            id="filter0_d_2242_235"
                                            color-interpolation-filters="sRGB"
                                            filterUnits="userSpaceOnUse"
                                            height="109.463"
                                            width="109.456"
                                            x="6.99023"
                                            y="8.99963"
                                        >
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix
                                                in="SourceAlpha"
                                                result="hardAlpha"
                                                type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                            />
                                            <feOffset dy="2" />
                                            <feGaussianBlur stdDeviation="2" />
                                            <feComposite in2="hardAlpha" operator="out" />
                                            <feColorMatrix
                                                type="matrix"
                                                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
                                            />
                                            <feBlend
                                                in2="BackgroundImageFix"
                                                mode="normal"
                                                result="effect1_dropShadow_2242_235"
                                            />
                                            <feBlend
                                                in="SourceGraphic"
                                                in2="effect1_dropShadow_2242_235"
                                                mode="normal"
                                                result="shape"
                                            />
                                        </filter>
                                    </defs>
                                </svg>
                            </div>

                            <span class="font-template text-7 fw-800 whitespace-nowrap text-[#000000]">
                                Tetris Online Study
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="chart_valid" ref="chart_container" class="mt-6.25">
            <v1-tos-info-chart-line />
        </div>
    </template>
</template>
