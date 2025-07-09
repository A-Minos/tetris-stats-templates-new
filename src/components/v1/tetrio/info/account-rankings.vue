<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import Avatar from '~/types/avatar';

const data = useData(
    z
        .object({
            user: z.object({
                avatar: Avatar,
                name: z.string(),
                bio: z.string().nullable(),
            }),
            multiplayer: z.object({
                glicko: z.string(),
                rd: z.number(),
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
            :keypath="`v1.tetrio.info.account.title`"
            tag="span"
            class="font-template text-8.75 fw-900 text-[#000]"
        ></i18n-t>

        <div class="mt-2.5">
            <div class="flex gap-6.25">
                <div
                    class="flex size-68.75 rounded-7.5 bg-[#fafafa] shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]"
                >
                    <div class="size-full p-6.25 box-border">
                        <div class="flex flex-col items-center gap-2.5 h-full justify-center">
                            <shared-avatar
                                :avatar="data.user.avatar"
                                alt="user.avatar"
                                class="size-31.25 rounded-full shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]"
                            />
                            <span class="font-template text-6.25 fw-800 text-[#000000]">{{ data.user.name }}</span>

                            <div v-if="isNonNullish(data.user.bio)" class="text-center">
                                <span class="font-template text-4.5 fw-400 text-[#000000] break-all line-clamp-3">
                                    {{ data.user.bio }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="size-68.75 rounded-7.5 bg-[#fafafa] shadow-[0rem_0.5625rem_1.5625rem_0rem_rgba(0,0,0,0.15)]"
                >
                    <div class="size-full p-6.25 box-border">
                        <div class="flex flex-col gap-2.5">
                            <div class="flex flex-col">
                                <img alt="tetr.io" class="size-15 rounded-2.5" src="~/assets/images/logo/tetrio.png" />
                                <span class="font-template text-7.5 fw-800 text-[#000000]">TETR.IO</span>
                            </div>

                            <div class="w-full border-t-([0.0625rem] solid [#bababa])" />

                            <div class="flex flex-col">
                                <span class="font-template text-6.25 fw-800 text-[#000000]">Ranking</span>

                                <span class="font-template text-12.5 fw-400 lh-[120%] text-[#000000]">
                                    {{ data.multiplayer.glicko }}
                                </span>

                                <span class="font-template text-7.5 fw-300 lh-[120%] -mt-3.75 text-[#000000]">
                                    ±{{ data.multiplayer.rd }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="chart_valid" ref="chart_container" class="mt-6.25">
            <v1-tetrio-info-chart-line />
        </div>
    </template>
</template>
