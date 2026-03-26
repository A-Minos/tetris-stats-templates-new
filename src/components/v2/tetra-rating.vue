<script lang="ts" setup>
import type { TextProps } from 'naive-ui';
import { isNonNullish, isNullish } from 'remeda';

const props = defineProps<{
    readonly glicko: number | null;
    readonly rd: number | null;
    readonly decaying: boolean;
}>();

const attributes = computed(() => {
    const rdOverflow = !isNullish(props.rd) && props.rd >= 100;
    const arrowStatus = !props.decaying ? 'default' : props.rd! >= 98 ? 'error' : 'warning';

    return {
        depth: rdOverflow ? undefined : (3 as TextProps['depth']),
        status: rdOverflow ? 'error' : 'default',
        arrow: {
            depth: props.decaying ? undefined : (3 as TextProps['depth']),
            status: arrowStatus,
        },
    };
});
</script>

<template>
    <n-flex :size="0">
        <n-text v-if="isNonNullish(glicko)" :depth="3">{{ glicko }}</n-text>

        <template v-if="isNonNullish(rd)">
            <n-text :depth="3">±</n-text>
            <n-text :depth="attributes.depth" :type="attributes.status">{{ rd }}</n-text>
        </template>

        <n-text
            v-if="decaying"
            :depth="attributes.arrow.depth"
            :type="attributes.arrow.status"
            class="text-4 font-[HUN]"
        >
            Ƿ
        </n-text>
    </n-flex>
</template>
