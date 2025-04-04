<script setup lang="ts">
import { z } from 'zod';

const data = useData(
    z
        .object({
            user: z.object({
                bad_standing: z.boolean(),
            }),
        })

        .readonly(),
);
</script>

<template>
    <template v-if="data.user.bad_standing">
        <n-alert :show-icon="false" type="error">
            <div class="text-center">
                <n-flex :size="0" vertical>
                    <n-text class="text-2xl fw-bold">BAD STANDING</n-text>
                    <n-text class="my-2">近期有一次或多次违禁行为</n-text>
                </n-flex>
            </div>
        </n-alert>
    </template>
</template>
