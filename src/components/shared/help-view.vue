<script lang="ts" setup>
import type { HelpNode } from '~/types/help';
import { createUsageTokens, renderArgToken } from '~/utils/help';
import HelpSignature from '~/components/shared/help-signature.vue';

defineProps<{
    readonly command: HelpNode;
    readonly breadcrumb: string[];
    readonly accent?: string;
}>();
</script>

<template>
    <n-flex vertical>
        <n-divider class="!my-0">{{ $t('help.usage') }}</n-divider>
        <n-card size="small">
            <HelpSignature :tokens="createUsageTokens(command, breadcrumb)" class="text-base" />
        </n-card>

        <n-divider v-if="command.args.length" class="!my-0">{{ $t('help.arguments') }}</n-divider>
        <n-card v-if="command.args.length" size="small">
            <n-table :bordered="false" :single-line="false" size="small" class="help-table">
                <tbody>
                    <tr v-for="arg in command.args" :key="arg.name">
                        <td class="w-1/3 help-command">
                            <n-text :type="arg.optional ? 'default' : 'error'" :depth="arg.optional ? 3 : undefined">
                                {{ renderArgToken(arg) }}
                            </n-text>
                        </td>
                        <td>
                            <n-text :depth="2">{{ arg.notice || arg.type_repr }}</n-text>
                            <n-tag v-if="arg.default !== null" size="small" round class="ml-2">
                                {{ $t('help.default', { value: arg.default }) }}
                            </n-tag>
                        </td>
                    </tr>
                </tbody>
            </n-table>
        </n-card>

        <n-divider v-if="command.options.length" class="!my-0">{{ $t('help.options') }}</n-divider>
        <n-card v-if="command.options.length" size="small">
            <n-table :bordered="false" :single-line="false" size="small" class="help-table">
                <tbody>
                    <tr v-for="option in command.options" :key="option.dest">
                        <td class="w-1/3">
                            <n-flex align="baseline" :size="6" class="help-command">
                                <n-text type="info" class="fw-600">{{ option.name }}</n-text>
                                <n-text v-if="option.aliases.length" :depth="3" class="text-xs">
                                    {{ option.aliases.join(', ') }}
                                </n-text>
                                <n-text
                                    v-for="arg in option.args"
                                    :key="arg.name"
                                    :type="arg.optional ? 'default' : 'error'"
                                    :depth="arg.optional ? 3 : undefined"
                                >
                                    {{ renderArgToken(arg) }}
                                </n-text>
                            </n-flex>
                        </td>
                        <td>
                            <n-text :depth="2">{{ option.help_text }}</n-text>
                            <template v-for="arg in option.args" :key="arg.name">
                                <n-tag v-if="arg.default !== null" size="small" round class="ml-2">
                                    {{ $t('help.default', { value: arg.default }) }}
                                </n-tag>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </n-table>
        </n-card>

        <n-divider v-if="command.subcommands.length" class="!my-0">{{ $t('help.subcommands') }}</n-divider>
        <n-card v-if="command.subcommands.length" size="small">
            <n-flex vertical :size="0">
                <div
                    v-for="subcommand in command.subcommands"
                    :key="subcommand.dest"
                    class="grid grid-cols-[minmax(160px,1fr)_2fr] gap-4 py-3 border-b border-white/8 last:border-b-0"
                >
                    <div>
                        <span class="inline-block size-2.5 mr-2 rounded-sm" :style="{ background: accent }" />
                        <n-text class="help-command fw-bold">{{ subcommand.name }}</n-text>
                        <n-text v-if="subcommand.aliases.length" :depth="3" class="block text-xs mt-1">
                            {{ subcommand.aliases.join(', ') }}
                        </n-text>
                    </div>
                    <n-text :depth="2">{{ subcommand.help_text }}</n-text>
                </div>
            </n-flex>
        </n-card>
    </n-flex>
</template>

<style scoped>
.help-table td {
    vertical-align: top;
    overflow-wrap: anywhere;
}
</style>
