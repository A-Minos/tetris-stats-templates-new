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
    <n-flex align="center" size="small" class="text-xs">
        <n-text :depth="3">{{ $t('v2.tetrio.replay') }}</n-text>
        <n-a :href="`https://tetr.io/#R:${data.replay_id}`" target="_blank" class="break-all">
            r:{{ data.replay_id }}
        </n-a>
    </n-flex>
</template>
