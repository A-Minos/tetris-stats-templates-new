<script lang="ts" setup>
import { z } from 'zod';

const data = useData(
    z
        .object({
            replay_id: z.string(),
        })
        .readonly(),
);
</script>

<template>
    <n-card size="small">
        <n-flex :size="0" vertical>
            <n-flex justify="space-between">
                <n-text>回放 ID</n-text>
                <n-text>r:{{ data.replay_id }}</n-text>
            </n-flex>
        </n-flex>
    </n-card>
</template>
