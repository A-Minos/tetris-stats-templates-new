<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import Languages from '~/core/shared/languages';

const data = useData<{
    readonly _lang: Languages;

    readonly user: {
        readonly avatar: string;
        readonly name: string;
        readonly bio: string;
    };

    readonly multiplayer: {
        readonly glicko: number;
        readonly rd: number;
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
        <template v-if="data._lang === Languages.enUS">
            <span class="font-template text-8.75 fw-900 color-[#000000]">Account & Rankings</span>
        </template>

        <template v-if="data._lang === Languages.zhCN">
            <span class="font-template text-8.75 fw-900 color-[#000000]">账号与排位</span>
        </template>

        <div class="mt-2.75">
            <div class="flex gap-6.25">
                <div class="size-68.75 rounded-7.5 bg-[#fafafa]" style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026">
                    <div class="size-full p-6.25 box-border">
                        <div class="flex flex-col items-center gap-2.5">
                            <img :src="data.user.avatar" alt="user.avatar" class="size-31.25 rounded-full" />
                            <span class="font-template text-6.25 fw-800 text-[#000000]">{{ data.user.name }}</span>

                            <div class="text-center">
                                <span class="font-template text-4.5 fw-400 text-[#000000]">{{ data.user.bio }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="size-68.75 rounded-7.5 bg-[#fafafa]" style="box-shadow: 0 0.5625rem 1.5625rem 0 #00000026">
                    <div class="size-full p-6.25 box-border">
                        <div class="flex flex-col gap-2.5">
                            <div class="flex flex-col">
                                <img alt="tetr.io" class="size-15" src="~/assets/images/logo/tetrio.png" />
                                <span class="font-template text-7.5 fw-800 text-[#000000]">TETR.IO</span>
                            </div>

                            <div class="w-full border-t-([0.0625rem] solid [#bababa])" />

                            <div class="flex flex-col">
                                <span class="font-template text-6.25 fw-800 text-[#000000]">Ranking</span>

                                <span class="font-template text-12.5 fw-400 text-[#000000]">
                                    {{ data.multiplayer.glicko }}
                                </span>

                                <span class="font-template text-7.5 fw-300 -mt-4.35 text-[#000000]">
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
