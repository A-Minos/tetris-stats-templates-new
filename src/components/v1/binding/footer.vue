<script lang="ts" setup>
import z from 'zod';
import { Status } from '~/types/status';

const { t } = useI18n();

const data = useData(
    z
        .union([
            z.object({
                type: z.union([z.literal(Status.SUCCESS), z.literal(Status.UNVERIFIED), z.literal(Status.UNKNOWN)]),
                command: z.string(),
            }),
            z.object({
                type: z.literal(Status.UNBIND),
                command: z.string(),
                bot: z.object({
                    name: z.string(),
                }),
            }),
            z.object({
                type: z.literal(Status.ERROR),
                error: z.string(),
            }),
        ])
        .readonly(),
);
</script>

<template>
    <i18n-t
        :keypath="`v1.binding.footer.${data.type}.text`"
        :style="{ 'font-weight': t(`v1.binding.footer.${data.type}.styles.fw`) }"
        tag="span"
        class="w-81 mx-auto font-template text-4 text-center text-[#52525C]"
    >
        <template
            v-if="
                data.type === Status.SUCCESS ||
                data.type === Status.UNVERIFIED ||
                data.type === Status.UNKNOWN ||
                data.type === Status.UNBIND
            "
            v-slot:command
        >
            <span class="fw-500">“{{ data.command }}”</span>
        </template>
        <template v-if="data.type === Status.UNBIND" v-slot:botName>
            <span class="fw-500">{{ data.bot.name }}</span>
        </template>
        <template v-if="data.type === Status.ERROR" v-slot:error>
            <span>{{ data.error }}</span>
        </template>
    </i18n-t>
</template>
