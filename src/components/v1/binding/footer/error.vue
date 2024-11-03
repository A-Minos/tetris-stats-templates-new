<script lang="ts" setup>
import Languages from '~/core/shared/languages';

const data = useData<{
    readonly _lang: Languages;
    readonly error: string;
}>();
</script>

<template>
    <template v-if="data._lang === Languages.enUS">
        <span class="w-81 mx-auto font-template fw-500 text-4 text-center text-[#52525C]">
            {{ data.error }}
        </span>
    </template>

    <template v-if="data._lang === Languages.zhCN">
        <span class="w-81 mx-auto font-template fw-500 text-4 text-center text-[#52525C]">
            {{ data.error }}
        </span>
    </template>
</template>

<style lang="scss">
@import '~/styles/v1.scss';
</style>
