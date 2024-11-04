<script lang="ts" setup>
import { Status } from '~/components/v1/binding/status/index.vue';

const { t } = useI18n();

const data = useData<{
    readonly type: Status;

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
    <i18n-t
        :keypath="`v1.binding.main.${data.type}.text`"
        :style="{ 'font-weight': t(`v1.binding.main.${data.type}.styles.fw`) }"
        tag="span"
        class="w-95.75 mx-auto font-template text-6.25 text-center text-[#000000]"
    >
        <template v-slot:userName>
            <span class="fw-800">{{ data.user.name }}</span>
        </template>
        <template v-slot:gamePlatform>
            <span class="fw-800">{{ data.platform }}</span>
        </template>
        <template v-slot:botName>
            <span>{{ data.bot.name }}</span>
        </template>
    </i18n-t>
</template>
