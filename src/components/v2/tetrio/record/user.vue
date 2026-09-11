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
    <div class="flex items-center gap-3 min-w-0">
        <n-image
            :img-props="{ class: 'size-16 rounded-sm object-cover' }"
            :src="getAvatar(data.user.avatar)"
            :alt="data.user.name"
            preview-disabled
        />
        <div class="min-w-0">
            <n-text class="block text-2xl fw-bold break-all">{{ data.user.name }}</n-text>
            <n-text :depth="3" class="block text-xs break-all">{{ data.user.id }}</n-text>
        </div>
    </div>
</template>
