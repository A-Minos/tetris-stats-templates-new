<script lang="ts" setup>
import { z } from 'zod';
import { HelpNode } from '~/types/help';

const data = useData(
    z
        .object({
            command: HelpNode,
            breadcrumb: z.array(z.string()),
        })
        .readonly(),
);

const visibleArgs = computed(() => data.command.args);
const visibleOptions = computed(() => data.command.options);
const visibleSubcommands = computed(() => data.command.subcommands);

/**
 * Render an arg as `<name>` (required) or `[name]` (optional). This matches
 * the conventional CLI --help syntax users already understand.
 */
const renderArgToken = (name: string, optional: boolean): string => (optional ? `[${name}]` : `<${name}>`);

/** Limit alias visual noise: keep at most the first 2. */
const trimAliases = (aliases: string[]): string[] => aliases.slice(0, 2);

/** Tokenized usage line so we can color required/optional/flag pieces. */
type UsageToken = { text: string; kind: 'path' | 'required' | 'optional' | 'flag' };

const usageTokens = computed<UsageToken[]>(() => {
    const tokens: UsageToken[] = [];
    for (const seg of data.breadcrumb) tokens.push({ text: seg, kind: 'path' });
    for (const a of visibleArgs.value) {
        tokens.push({
            text: renderArgToken(a.name, a.optional),
            kind: a.optional ? 'optional' : 'required',
        });
    }
    for (const o of visibleOptions.value) {
        const inner = [o.name, ...o.args.map((a) => renderArgToken(a.name, a.optional))].join(' ');
        tokens.push({ text: `[${inner}]`, kind: 'flag' });
    }
    return tokens;
});

/** Map token kinds to Naive UI text types so colours follow the dark theme. */
const tokTypeOf = (kind: UsageToken['kind']): 'default' | 'error' | 'info' => {
    switch (kind) {
        case 'required':
            return 'error';
        case 'flag':
            return 'info';
        default:
            return 'default';
    }
};
const tokDepthOf = (kind: UsageToken['kind']): 1 | 2 | 3 | undefined => {
    return kind === 'optional' ? 3 : undefined;
};
</script>

<template>
    <n-flex vertical :size="20">
        <!-- Hero: title + aliases + description -->
        <div>
            <n-flex align="baseline" :size="12" :wrap="true">
                <n-text class="text-9 fw-700 tracking-[-0.01em]" :depth="1">{{ data.command.name }}</n-text>
                <n-text
                    v-for="alias in trimAliases(data.command.aliases)"
                    :key="alias"
                    class="font-mono text-3.25"
                    :depth="3"
                >
                    {{ alias }}
                </n-text>
            </n-flex>
            <n-text v-if="data.command.help_text" class="block mt-2 text-4 leading-6" :depth="2">
                {{ data.command.help_text }}
            </n-text>
        </div>

        <!-- USAGE -->
        <n-card size="small">
            <template #header>
                <n-text class="text-2.75 fw-600 tracking-[0.12em] uppercase" :depth="3">USAGE</n-text>
            </template>
            <pre class="m-0 font-mono text-3.75 leading-6 whitespace-pre-wrap break-words"><n-text
                v-for="(t, i) in usageTokens"
                :key="i"
                :type="tokTypeOf(t.kind)"
                :depth="tokDepthOf(t.kind)"
                :class="t.kind === 'flag' || t.kind === 'path' ? 'fw-500' : ''"
            >{{ i === 0 ? '' : ' ' }}{{ t.text }}</n-text></pre>
        </n-card>

        <!-- ARGUMENTS -->
        <n-card v-if="visibleArgs.length > 0" size="small">
            <template #header>
                <n-text class="text-2.75 fw-600 tracking-[0.12em] uppercase" :depth="3">ARGUMENTS</n-text>
            </template>
            <n-flex vertical :size="0">
                <div
                    v-for="(arg, ri) in visibleArgs"
                    :key="arg.name"
                    class="grid grid-cols-[minmax(160px,max-content)_1fr] items-baseline gap-x-6 py-3"
                    :class="ri > 0 ? 'border-t border-white/9' : 'pt-1'"
                >
                    <div class="font-mono text-3.5">
                        <n-text :type="arg.optional ? 'default' : 'error'" :depth="arg.optional ? 3 : undefined">
                            {{ renderArgToken(arg.name, arg.optional) }}
                        </n-text>
                    </div>
                    <n-flex align="baseline" :size="8" :wrap="true">
                        <n-text class="text-3.75 leading-6" :depth="2">{{ arg.notice || arg.type_repr || '' }}</n-text>
                        <n-text v-if="arg.default" class="text-3.25" :depth="3">默认 {{ arg.default }}</n-text>
                    </n-flex>
                </div>
            </n-flex>
        </n-card>

        <!-- OPTIONS -->
        <n-card v-if="visibleOptions.length > 0" size="small">
            <template #header>
                <n-text class="text-2.75 fw-600 tracking-[0.12em] uppercase" :depth="3">OPTIONS</n-text>
            </template>
            <n-flex vertical :size="0">
                <div
                    v-for="(opt, ri) in visibleOptions"
                    :key="opt.dest"
                    class="grid grid-cols-[minmax(160px,max-content)_1fr] items-baseline gap-x-6 py-3"
                    :class="ri > 0 ? 'border-t border-white/9' : 'pt-1'"
                >
                    <n-flex align="baseline" :size="6" :wrap="true" class="font-mono text-3.5">
                        <n-text type="info" class="fw-500">{{ opt.name }}</n-text>
                        <template v-if="trimAliases(opt.aliases).length">
                            <n-text class="text-3.25" :depth="3">,</n-text>
                            <n-text type="info" class="op-75">
                                {{ trimAliases(opt.aliases).join(', ') }}
                            </n-text>
                        </template>
                        <template v-for="arg in opt.args" :key="arg.name">
                            <n-text :type="arg.optional ? 'default' : 'error'" :depth="arg.optional ? 3 : undefined">
                                {{ renderArgToken(arg.name, arg.optional) }}
                            </n-text>
                        </template>
                    </n-flex>
                    <n-text class="text-3.75 leading-6" :depth="2">{{ opt.help_text || '' }}</n-text>
                </div>
            </n-flex>
        </n-card>

        <!-- SUBCOMMANDS -->
        <n-card v-if="visibleSubcommands.length > 0" size="small">
            <template #header>
                <n-text class="text-2.75 fw-600 tracking-[0.12em] uppercase" :depth="3">SUBCOMMANDS</n-text>
            </template>
            <n-flex vertical :size="0">
                <div
                    v-for="(sub, ri) in visibleSubcommands"
                    :key="sub.dest"
                    class="grid grid-cols-[minmax(160px,max-content)_1fr] items-baseline gap-x-6 py-3"
                    :class="ri > 0 ? 'border-t border-white/9' : 'pt-1'"
                >
                    <n-flex align="baseline" :size="6" :wrap="true" class="font-mono text-3.5">
                        <n-text class="fw-600" :depth="1">{{ sub.name }}</n-text>
                        <n-text v-if="trimAliases(sub.aliases).length" class="text-3.25" :depth="3">
                            {{ trimAliases(sub.aliases).join(', ') }}
                        </n-text>
                    </n-flex>
                    <n-text class="text-3.75 leading-6" :depth="2">{{ sub.help_text || '' }}</n-text>
                </div>
            </n-flex>
        </n-card>
    </n-flex>
</template>
