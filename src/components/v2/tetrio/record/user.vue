<script lang="ts" setup>
import { z } from 'zod';
import { getAvatar } from '~/components/shared/avatar.vue';
import Avatar from '~/types/avatar';

const data = useData(
    z
        .object({
            user: z.object({
                avatar: Avatar,
                name: z.string(),
                id: z.string(),
            }),
        })
        .readonly(),
);
</script>

<template>
    <n-card class="w-fit">
        <div class="flex flex-col justify-center items-center h-full">
            <n-flex align="center" vertical>
                <n-image :img-props="{ class: 'size-32' }" :src="getAvatar(data.user.avatar)" />

                <n-text class="text-(6 current) fw-bold leading-none">
                    {{ data.user.name }}
                </n-text>

                <n-text :depth="3" class="text-xs">{{ data.user.id }}</n-text>
            </n-flex>
        </div>
    </n-card>
</template>
