<script lang="ts" setup>
import { z } from 'zod';

const data = useData(
    z
        .object({
            user: z.object({
                badges: z.array(
                    z.object({
                        id: z.string(),
                        description: z.string(),
                        group: z.string().nullable(),
                        receive_at: z.coerce.date().nullable(),
                    }),
                ),
            }),
        })
        .readonly(),
);
</script>

<template>
    <template v-if="data.user.badges.length > 0">
        <n-card size="small">
            <n-flex justify="center">
                <template v-for="badge in data.user.badges">
                    <n-image :src="`https://tetr.io/res/badges/${badge.id}.png`" class="[&>img]:h-6" />
                </template>
            </n-flex>
        </n-card>
    </template>
</template>
