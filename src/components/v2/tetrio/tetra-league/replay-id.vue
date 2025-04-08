<script lang="ts" setup>
defineProps<{
    readonly replay_id: string;
}>();
</script>

<template>
    <n-card class="text-5" size="small">
        <n-flex justify="space-evenly">
            <div class="text-center">
                {{ $t('v2.tetrio.replay') }}:
                <n-a :href="`https://tetr.io/#R:${replay_id}`" target="_blank"> r:{{ replay_id }} </n-a>
            </div>
        </n-flex>
    </n-card>
</template>
