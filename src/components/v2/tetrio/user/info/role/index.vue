<script lang="ts" setup>
import { z } from 'zod';

const data = useData(
    z
        .object({
            user: z.object({
                role: z.union([
                    z.literal('anon'),
                    z.literal('user'),
                    z.literal('bot'),
                    z.literal('halfmod'),
                    z.literal('mod'),
                    z.literal('admin'),
                    z.literal('sysop'),
                    z.literal('hidden'),
                    z.literal('banned'),
                ]),
                botmaster: z.string().nullable(),
            }),
        })
        .readonly(),
);
</script>

<template>
    <v2-tetrio-user-info-role-banned v-if="data.user.role === 'banned'" />
    <v2-tetrio-user-info-role-bot v-else-if="data.user.role === 'bot'" :master="data.user.botmaster" />
</template>
