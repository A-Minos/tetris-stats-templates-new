<script lang="ts" setup>
import Languages from '~/core/shared/languages';

const data = useData<{
    readonly _lang: Languages;
    readonly platform: string;

    readonly user: {
        readonly name: string;
    };

    readonly bot: {
        readonly name: string;
    };
}>();
</script>

<template>
    <template v-if="data._lang === Languages.enUS">
        <span class="w-95.75 mx-auto font-template fw-800 text-6.25 text-center text-[#000000]">
            <span>{{ data.user.name }}</span>
            <span class="font-template fw-400 text-6.75 text-center">, your account on</span>
            <span>&nbsp;{{ data.platform }}&nbsp;</span>

            <span class="font-template fw-400 text-6.25 text-center">
                was successfully unlinked from {{ data.bot.name }}.
            </span>
        </span>
    </template>

    <template v-if="data._lang === Languages.zhCN">
        <span class="w-95.75 mx-auto font-template fw-350 text-6.25 text-center text-[#000000]">
            <span>已将你在</span>
            <span class="font-template fw-800 text-6.25 text-center">&nbsp;{{ data.platform }}&nbsp;</span>
            <span>上的账号</span>

            <br />
            <span class="font-template fw-800 text-6.25 text-center">{{ data.user.name }}</span>
            <br />

            <span>成功从 {{ data.bot.name }} 解绑.</span>
        </span>
    </template>
</template>

<style lang="scss">
@import '~/styles/v1.scss';
</style>
