<script lang="ts" setup>
import type { UsageToken } from '~/utils/help';

defineProps<{
    readonly tokens: UsageToken[];
    readonly large?: boolean;
}>();
</script>

<template>
    <code class="help-signature" :class="{ 'help-signature--large': large }"
        ><template v-for="(token, index) in tokens" :key="index"
            >{{ index === 0 ? '' : ' ' }}<span :class="`help-token--${token.kind}`">{{ token.text }}</span></template
        ></code
    >
</template>
