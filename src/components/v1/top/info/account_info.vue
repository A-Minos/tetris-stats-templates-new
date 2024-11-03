<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import Languages from '~/core/shared/languages';

const data = useData<{
    readonly _lang: Languages;

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
</script>

<template>
    <template v-if="valid">
        <template v-if="data._lang === Languages.enUS">
            <span class="font-template text-8.75 fw-900 color-[#000000]">Account Info</span>
        </template>

        <template v-if="data._lang === Languages.zhCN">
            <span class="font-template text-8.75 fw-900 color-[#000000]">账号信息</span>
        </template>

        <div class="mt-2.75">
            <div class="flex gap-6.25">
                <div
                    class="w-68.75 h-31.25 rounded-7.5 bg-[#fafafa]"
                    style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026"
                >
                    <div class="size-full p-7.5 box-border">
                        <div class="flex gap-7 items-center">
                            <img :src="data.user.avatar" alt="user.avatar" class="size-15 rounded-full" />
                            <span class="font-template text-7.5 fw-800 text-[#000000]">{{ data.user.name }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="w-68.75 h-31.25 rounded-7.5 bg-[#fafafa]"
                    style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026"
                >
                    <div class="size-full p-7.5 box-border">
                        <div class="flex gap-5 items-center">
                            <div class="size-15 rounded-2.5">
                                <svg
                                    fill="none"
                                    height="61"
                                    viewBox="0 0 60 61"
                                    width="60"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect fill="#1D1916" height="60" rx="10" width="60" y="0.5" />
                                    <path
                                        d="M26.8 5.84752C27.9658 5.17446 28.5487 4.83793 29.1684 4.70621C29.7167 4.58967 30.2833 4.58967 30.8316 4.70621C31.4513 4.83793 32.0342 5.17446 33.2 5.84752L49.3167 15.1525C50.4824 15.8255 51.0653 16.1621 51.4892 16.6329C51.8643 17.0495 52.1477 17.5402 52.3209 18.0733C52.5167 18.6759 52.5167 19.3489 52.5167 20.695V39.305C52.5167 40.6511 52.5167 41.3241 52.3209 41.9267C52.1477 42.4598 51.8643 42.9505 51.4892 43.3671C51.0653 43.8379 50.4824 44.1745 49.3167 44.8475L33.2 54.1525C32.0342 54.8255 31.4513 55.1621 30.8316 55.2938C30.2833 55.4103 29.7167 55.4103 29.1684 55.2938C28.5487 55.1621 27.9658 54.8255 26.8 54.1525L10.6833 44.8475C9.51757 44.1745 8.93468 43.8379 8.51076 43.3671C8.13567 42.9505 7.85233 42.4598 7.67911 41.9267C7.48334 41.3241 7.48334 40.6511 7.48334 39.305V20.695C7.48334 19.3489 7.48334 18.6759 7.67911 18.0733C7.85233 17.5402 8.13567 17.0495 8.51076 16.6329C8.93468 16.1621 9.51757 15.8255 10.6833 15.1525L26.8 5.84752Z"
                                        fill="#17A34A"
                                    />
                                    <path d="M9 23L9 26H14V37H17V26H22V23H9Z" fill="#FEF18B" />
                                    <path
                                        clip-rule="evenodd"
                                        d="M23.109 23.546C23 23.7599 23 24.0399 23 24.6V35.4C23 35.9601 23 36.2401 23.109 36.454C23.2049 36.6422 23.3578 36.7951 23.546 36.891C23.7599 37 24.0399 37 24.6 37H34.4C34.9601 37 35.2401 37 35.454 36.891C35.6422 36.7951 35.7951 36.6422 35.891 36.454C36 36.2401 36 35.9601 36 35.4V24.6C36 24.0399 36 23.7599 35.891 23.546C35.7951 23.3578 35.6422 23.2049 35.454 23.109C35.2401 23 34.9601 23 34.4 23H24.6C24.0399 23 23.7599 23 23.546 23.109C23.3578 23.2049 23.2049 23.3578 23.109 23.546ZM33 26H26V34H33V26Z"
                                        fill="#FEF18B"
                                        fill-rule="evenodd"
                                    />
                                    <path
                                        clip-rule="evenodd"
                                        d="M37 37V23H48.4C48.9601 23 49.2401 23 49.454 23.109C49.6422 23.2049 49.7951 23.3578 49.891 23.546C50 23.7599 50 24.0399 50 24.6V31.4C50 31.9601 50 32.2401 49.891 32.454C49.7951 32.6422 49.6422 32.7951 49.454 32.891C49.2401 33 48.9601 33 48.4 33H40V37H37ZM40 26H47V30H40V26Z"
                                        fill="#FEF18B"
                                        fill-rule="evenodd"
                                    />
                                </svg>
                            </div>

                            <span
                                class="font-template text-6.25 fw-800 leading-[100%] whitespace-nowrap text-[#000000]"
                            >
                                <span>Tetris Online</span>
                                <br />
                                <span>Poland</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
