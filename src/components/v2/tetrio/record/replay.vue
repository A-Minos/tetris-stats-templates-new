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
                <n-text>{{ $t('v2.tetrio.record.replay') }}</n-text>
                <n-a :href="`https://tetr.io/#R:${data.replay_id}`" target="_blank"> r:{{ data.replay_id }} </n-a>
            </n-flex>
        </n-flex>
    </n-card>
</template>
