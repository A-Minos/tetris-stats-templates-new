<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import { z } from 'zod';
const data = useData(
    z
        .object({
            user: z.object({
                bio: z.string().nullable(),
            }),
        })
        .readonly(),
);

const text = computed(() => {
    return data.user.bio === null ? null : new DOMParser().parseFromString(data.user.bio, 'text/html').body.textContent;
});
</script>

<template>
    <n-card size="small" v-if="isNonNullish(text)">
        {{ text }}
    </n-card>
</template>
