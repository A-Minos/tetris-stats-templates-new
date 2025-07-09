<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import top from '~/assets/images/logo/top.svg';

const data = useData(
    z
        .object({
            user: z.object({
                avatar: z.string(),
                name: z.string(),
            }),
        })
        .readonly(),
);

const valid = computed(() => {
    if (isNullish(data.user)) {
        return false;
    }

    return isNonNullish(data.user.avatar) && isNonNullish(data.user.name);
});
</script>

<template>
    <template v-if="valid">
        <i18n-t
            :keypath="`v1.top.info.account.title`"
            tag="span"
            class="font-template text-8.75 fw-900 color-[#000000]"
        ></i18n-t>

        <div class="mt-2.75">
            <div class="flex gap-6.25">
                <div
                    class="w-68.75 h-31.25 rounded-7.5 bg-[#fafafa] shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]"
                >
                    <div class="size-full p-7.5 box-border">
                        <div class="flex gap-7 items-center">
                            <img :src="data.user.avatar" alt="user.avatar" class="size-15 rounded-full" />
                            <span class="font-template text-7.5 fw-800 text-[#000000]">{{ data.user.name }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="w-68.75 h-31.25 rounded-7.5 bg-[#fafafa] shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]"
                >
                    <div class="size-full p-7.5 box-border">
                        <div class="flex gap-5 items-center">
                            <img :src="top" class="size-15 rounded-2.5" />

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
