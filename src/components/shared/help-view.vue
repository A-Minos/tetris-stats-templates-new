<script lang="ts" setup>
import type { HelpNodeT } from '~/types/help';

const props = defineProps<{
    node: HelpNodeT;
    /** Full breadcrumb to the current node, used to synthesize a usage line. */
    breadcrumb: string[];
}>();

const visibleArgs = computed(() => props.node.args.filter((a) => !a.hidden));
const visibleOptions = computed(() => props.node.options);
const visibleSubcommands = computed(() => props.node.subcommands);

/**
 * Render an arg as `<name>` (required) or `[name]` (optional). This is the
 * conventional CLI syntax users already understand from --help on classic
 * tools, so we don't need a separate "required/optional" badge.
 */
const renderArgToken = (name: string, optional: boolean): string => (optional ? `[${name}]` : `<${name}>`);

/** Synthesized one-line usage: `tstats TETR.IO query <account> [--template <template>] ...` */
const usageLine = computed(() => {
    const parts: string[] = [...props.breadcrumb];
    for (const a of visibleArgs.value) parts.push(renderArgToken(a.name, a.optional));
    for (const o of visibleOptions.value) {
        const inner = [o.name, ...o.args.filter((a) => !a.hidden).map((a) => renderArgToken(a.name, a.optional))].join(
            ' ',
        );
        parts.push(`[${inner}]`);
    }
    return parts.join(' ');
});

/** Limit alias visual noise: keep at most the first 2. */
const trimAliases = (aliases: string[]): string[] => aliases.slice(0, 2);
</script>

<template>
    <n-flex vertical :size="20">
        <!-- Title -->
        <div>
            <n-flex align="baseline" :size="10" wrap>
                <n-text class="text-3xl" strong>{{ node.name }}</n-text>
                <n-text v-for="alias in trimAliases(node.aliases)" :key="alias" depth="3" class="text-sm">
                    {{ alias }}
                </n-text>
            </n-flex>
            <n-text v-if="node.help_text" depth="1" class="text-base">{{ node.help_text }}</n-text>
        </div>

        <!-- Usage syntax -->
        <div>
            <n-text depth="3" class="text-xs uppercase tracking-wide">用法</n-text>
            <div class="mt-1 font-mono text-base">{{ usageLine }}</div>
        </div>

        <!-- Args -->
        <div v-if="visibleArgs.length > 0">
            <n-text depth="3" class="text-xs uppercase tracking-wide">参数</n-text>
            <div class="mt-2 flex flex-col gap-2">
                <div v-for="arg in visibleArgs" :key="arg.name" class="flex items-baseline gap-3">
                    <span class="font-mono text-base min-w-30">{{ renderArgToken(arg.name, arg.optional) }}</span>
                    <span class="text-base">
                        {{ arg.notice || arg.type_repr || '' }}
                        <n-text v-if="arg.default" depth="3" class="ml-2 text-sm">默认 {{ arg.default }}</n-text>
                    </span>
                </div>
            </div>
        </div>

        <!-- Options -->
        <div v-if="visibleOptions.length > 0">
            <n-text depth="3" class="text-xs uppercase tracking-wide">选项</n-text>
            <div class="mt-2 flex flex-col gap-2">
                <div v-for="opt in visibleOptions" :key="opt.dest" class="flex items-baseline gap-3">
                    <span class="font-mono text-base">
                        {{ opt.name
                        }}<template v-if="trimAliases(opt.aliases).length"
                            >, {{ trimAliases(opt.aliases).join(', ') }}</template
                        >
                        <template v-for="arg in opt.args.filter((a) => !a.hidden)" :key="arg.name">
                            {{ ' ' }}{{ renderArgToken(arg.name, arg.optional) }}
                        </template>
                    </span>
                    <span class="text-base">{{ opt.help_text || '' }}</span>
                </div>
            </div>
        </div>

        <!-- Subcommands -->
        <div v-if="visibleSubcommands.length > 0">
            <n-text depth="3" class="text-xs uppercase tracking-wide">子命令</n-text>
            <div class="mt-2 flex flex-col gap-2">
                <div v-for="sub in visibleSubcommands" :key="sub.dest" class="flex items-baseline gap-3">
                    <span class="font-mono text-base min-w-30">{{ sub.name }}</span>
                    <span class="text-base">
                        {{ sub.help_text || '' }}
                        <n-text v-if="trimAliases(sub.aliases).length" depth="3" class="ml-2 text-sm">
                            ({{ trimAliases(sub.aliases).join(', ') }})
                        </n-text>
                    </span>
                </div>
            </div>
        </div>
    </n-flex>
</template>
