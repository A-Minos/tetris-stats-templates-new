<script lang="ts" setup>
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
                    <n-text class="text-2xl fw-bold">
                        {{ $t('v2.tetrio.user.info.status.bad_standing.title') }}
                    </n-text>
                    <n-text class="my-2">
                        {{ $t('v2.tetrio.user.info.status.bad_standing.description') }}
                    </n-text>
                </n-flex>
            </div>
        </n-alert>
    </template>
</template>
