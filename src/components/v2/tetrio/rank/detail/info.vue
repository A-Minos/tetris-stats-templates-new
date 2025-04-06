<script lang="ts" setup>
import { ValidRank } from '~/types/rank';

defineProps<{
    readonly name: ValidRank;
    readonly require_tr: number;
    readonly players: number;
}>();
</script>

<template>
    <n-flex align="center" size="small">
        <v2-rank :rank="name" class="[&>img]:size-6" />

        <n-flex :size="0" vertical>
            <n-text class="text-4 fw-bold">{{ require_tr }} TR</n-text>
            <n-text class="text-2 fw-bold">{{ players }} 玩家</n-text>
        </n-flex>
    </n-flex>
</template>
