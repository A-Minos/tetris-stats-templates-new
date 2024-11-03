<script lang="ts" setup>
import Languages from '~/core/shared/languages';

const data = useData<{
    readonly _lang: Languages;
    readonly command: string;
}>();
</script>

<template>
    <template v-if="data._lang === Languages.enUS">
        <span class="w-81 mx-auto font-template fw-500 text-4 text-center text-[#52525C]">
            You can now type in “{{ data.command }}” to start the verification process.
        </span>
    </template>

    <template v-if="data._lang === Languages.zhCN">
        <span class="w-81 mx-auto font-template fw-500 text-4 text-center text-[#52525C]">
            你可以输入 “{{ data.command }}” 命令来开始验证你的账号.
        </span>
    </template>
</template>

<style lang="scss">
@import '~/styles/v1.scss';
</style>
