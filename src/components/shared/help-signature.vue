<script lang="ts" setup>
import type { UsageToken } from '~/utils/help';

defineProps<{
    readonly tokens: UsageToken[];
    readonly large?: boolean;
}>();
</script>

<template>
    <code class="[font-family:var(--help-mono)] leading-[1.6]" :class="large ? 'text-[17px]' : 'text-[13px]'"
        ><template v-for="(token, index) in tokens" :key="index"
            >{{ index === 0 ? '' : ' '
            }}<span
                class="inline-block max-w-full [overflow-wrap:anywhere]"
                :class="
                    token.kind === 'path'
                        ? 'font-700 text-white'
                        : token.kind === 'required'
                          ? 'text-white/80'
                          : 'text-[var(--help-text-3)]'
                "
                >{{ token.text }}</span
            ></template
        ></code
    >
</template>
