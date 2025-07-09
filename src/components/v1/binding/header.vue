<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';
import Avatar from '~/types/avatar';

const data = useData(
    z
        .object({
            user: z.object({
                avatar: Avatar,
            }),
            bot: z.object({
                avatar: Avatar,
            }),
        })
        .readonly(),
);

const valid = computed(() => {
    if (isNullish(data.user)) {
        return false;
    }

    return isNonNullish(data.user.avatar) && isNonNullish(data.bot.avatar);
});
</script>

<template>
    <template v-if="valid">
        <div class="flex justify-between items-center gap-8">
            <template v-if="isNonNullish(data.user.avatar)">
                <shared-avatar
                    :avatar="data.user.avatar"
                    alt="user.avatar"
                    class="size-24 rounded-5 shadow-[0rem_0.6875rem_1.4375rem_0rem_rgba(0,0,0,0.22)]"
                />
            </template>

            <v1-binding-status />

            <template v-if="isNonNullish(data.bot.avatar)">
                <shared-avatar
                    :avatar="data.bot.avatar"
                    alt="bot.avatar"
                    class="size-24 rounded-5 shadow-[0rem_0.6875rem_1.4375rem_0rem_rgba(0,0,0,0.22)]"
                />
            </template>
        </div>
    </template>
</template>
