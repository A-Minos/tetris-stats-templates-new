<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import Languages from '~/core/shared/languages';

const data = useData<{
    readonly _lang: Languages;
}>();

const container = ref<HTMLDivElement>();

const valid = ref(true);

onMounted(() => {
    valid.value = isNonNullish(container.value) && container.value.childElementCount > 0;
});
</script>

<template>
    <template v-if="valid">
        <template v-if="data._lang === Languages.enUS">
            <span class="font-template text-8.75 fw-900 color-[#000000]">Historical Stats</span>
        </template>

        <template v-if="data._lang === Languages.zhCN">
            <span class="font-template text-8.75 fw-900 color-[#000000]">历史数据</span>
        </template>

        <div class="mt-3.75">
            <div ref="container" class="flex gap-6.25">
                <v1-top-info-card-lpm _key="historical" />
                <v1-top-info-card-apm _key="historical" />
            </div>
        </div>
    </template>
</template>
