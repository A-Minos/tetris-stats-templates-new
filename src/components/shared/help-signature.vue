<script lang="ts" setup>
import type { UsageToken } from '~/utils/help';

defineProps<{
    readonly tokens: UsageToken[];
}>();
</script>

<template>
    <code class="help-command leading-6 break-words">
        <n-text
            v-for="(token, index) in tokens"
            :key="index"
            :type="token.kind === 'required' ? 'error' : token.kind === 'flag' ? 'info' : 'default'"
            :depth="token.kind === 'optional' ? 3 : undefined"
            :class="{ 'fw-600': token.kind === 'path' }"
            >{{ index === 0 ? '' : ' ' }}{{ token.text }}</n-text
        >
    </code>
</template>
