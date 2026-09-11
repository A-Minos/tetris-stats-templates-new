<script lang="ts" setup>
import { NCard } from 'naive-ui';

defineProps<{
    readonly compact?: boolean;
}>();
</script>

<template>
    <component :is="compact ? 'div' : NCard" :size="compact ? undefined : 'small'">
        <div :class="compact ? 'text-right' : 'text-center'">
            <n-text
                :class="compact ? 'text-xs' : 'text-2xl fw-bold'"
                :type="compact ? undefined : 'warning'"
                :depth="compact ? 3 : undefined"
            >
                Powered by NoneBot2 x nonebot-plugin-tetris-stats
            </n-text>

            <br />

            <n-text :depth="3" class="text-xs">Designed by WOSHIZHAZHA120 Using Naive UI</n-text>
        </div>
    </component>
</template>
