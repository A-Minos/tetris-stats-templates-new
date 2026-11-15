<script lang="ts" setup>
import type { HelpArg, HelpNode } from '~/types/help';
import { createUsageTokens, renderArgToken } from '~/utils/help';

const props = defineProps<{
    readonly command: HelpNode;
    readonly breadcrumb: string[];
}>();

// A pure command group's usage is just its own path; the subcommand list says more.
const showUsage = computed(
    () => props.command.args.length || props.command.options.length || !props.command.subcommands.length,
);
const argClass = (arg: HelpArg) => (arg.optional ? 'text-[var(--help-text-3)]' : 'text-white/80');
</script>

<template>
    <shared-help-section v-if="showUsage" :title="$t('help.usage')">
        <div class="px-5 py-4 border-1 border-solid border-[var(--help-line)] rounded-[6px] bg-[var(--help-panel)]">
            <shared-help-signature :tokens="createUsageTokens(command, breadcrumb)" large />
        </div>
    </shared-help-section>

    <shared-help-section v-if="command.args.length" :title="$t('help.arguments')">
        <div
            class="px-5 py-4 border-1 border-solid border-[var(--help-line)] rounded-[6px] bg-[var(--help-panel)] grid [grid-template-columns:minmax(200px,max-content)_1fr] gap-x-12"
        >
            <div
                v-for="arg in command.args"
                :key="arg.name"
                class="grid col-span-full [grid-template-columns:subgrid] py-[10px] leading-[22px] [&+&]:border-t-1 [&+&]:border-t-solid [&+&]:border-[var(--help-line)]"
            >
                <code
                    class="flex items-baseline flex-wrap gap-x-2 gap-y-[2px] [font-family:var(--help-mono)] text-[14px] [overflow-wrap:anywhere]"
                    :class="argClass(arg)"
                    >{{ renderArgToken(arg) }}</code
                >
                <div class="text-[15px] text-[var(--help-text-2)]">
                    {{ arg.notice || arg.type_repr }}
                    <span v-if="arg.default !== null" class="ml-[10px] text-[13px] text-[var(--help-text-3)]">
                        {{ $t('help.default', { value: arg.default }) }}
                    </span>
                </div>
            </div>
        </div>
    </shared-help-section>

    <shared-help-section v-if="command.options.length" :title="$t('help.options')">
        <div
            class="px-5 py-4 border-1 border-solid border-[var(--help-line)] rounded-[6px] bg-[var(--help-panel)] grid [grid-template-columns:minmax(200px,max-content)_1fr] gap-x-12"
        >
            <div
                v-for="option in command.options"
                :key="option.dest"
                class="grid col-span-full [grid-template-columns:subgrid] py-[10px] leading-[22px] [&+&]:border-t-1 [&+&]:border-t-solid [&+&]:border-[var(--help-line)]"
            >
                <code
                    class="flex items-baseline flex-wrap gap-x-2 gap-y-[2px] [font-family:var(--help-mono)] text-[14px] [overflow-wrap:anywhere]"
                >
                    <span class="font-700 text-white">{{ option.name }}</span>
                    <span v-for="alias in option.aliases" :key="alias" class="text-[var(--help-text-3)]">{{
                        alias
                    }}</span>
                    <span v-for="arg in option.args" :key="arg.name" :class="argClass(arg)">
                        {{ renderArgToken(arg) }}
                    </span>
                </code>
                <div class="text-[15px] text-[var(--help-text-2)]">
                    {{ option.help_text }}
                    <template v-for="arg in option.args" :key="arg.name">
                        <span v-if="arg.default !== null" class="ml-[10px] text-[13px] text-[var(--help-text-3)]">
                            {{ $t('help.default', { value: arg.default }) }}
                        </span>
                        <span v-if="arg.notice" class="block text-[13px] text-[var(--help-text-3)]">{{
                            arg.notice
                        }}</span>
                    </template>
                </div>
            </div>
        </div>
    </shared-help-section>
</template>
