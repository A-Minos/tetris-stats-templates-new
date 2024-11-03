<script lang="ts" setup>
import { isNonNullish, isNullish } from 'remeda';

const data = useData<{
    readonly user: {
        readonly avatar: string;
    };

    readonly bot: {
        readonly avatar: string;
    };
}>();

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
                <img
                    :src="data.user.avatar"
                    alt="user.avatar"
                    class="size-24 rounded-5"
                    style="box-shadow: 0 0.6875rem 1.4375rem 0 #00000038"
                />
            </template>

            <v1-binding-status />

            <template v-if="isNonNullish(data.bot.avatar)">
                <img
                    :src="data.bot.avatar"
                    alt="bot.avatar"
                    class="size-24 rounded-5"
                    style="box-shadow: 0 0.6875rem 1.4375rem #00000038"
                />
            </template>
        </div>
    </template>
</template>
