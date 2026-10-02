<script lang="ts" setup>
import type { HelpArg, HelpNode } from '~/types/help';
import { createUsageTokens, renderArgToken } from '~/utils/help';
import HelpSection from '~/components/shared/help-section.vue';
import HelpSignature from '~/components/shared/help-signature.vue';

const props = defineProps<{
    readonly command: HelpNode;
    readonly breadcrumb: string[];
}>();

// A pure command group's usage is just its own path; the subcommand list says more.
const showUsage = computed(
    () => props.command.args.length || props.command.options.length || !props.command.subcommands.length,
);
const argClass = (arg: HelpArg) => (arg.optional ? 'help-token--optional' : 'help-token--required');
</script>

<template>
    <HelpSection v-if="showUsage" :title="$t('help.usage')">
        <div class="help-panel">
            <HelpSignature :tokens="createUsageTokens(command, breadcrumb)" large />
        </div>
    </HelpSection>

    <HelpSection v-if="command.args.length" :title="$t('help.arguments')">
        <div class="help-panel help-rows">
            <div v-for="arg in command.args" :key="arg.name" class="help-row">
                <code class="help-row-term" :class="argClass(arg)">{{ renderArgToken(arg) }}</code>
                <div class="help-row-description">
                    {{ arg.notice || arg.type_repr }}
                    <span v-if="arg.default !== null" class="help-default">
                        {{ $t('help.default', { value: arg.default }) }}
                    </span>
                </div>
            </div>
        </div>
    </HelpSection>

    <HelpSection v-if="command.options.length" :title="$t('help.options')">
        <div class="help-panel help-rows">
            <div v-for="option in command.options" :key="option.dest" class="help-row">
                <code class="help-row-term">
                    <span class="help-row-option">{{ option.name }}</span>
                    <span v-for="alias in option.aliases" :key="alias" class="help-row-alias">{{ alias }}</span>
                    <span v-for="arg in option.args" :key="arg.name" :class="argClass(arg)">
                        {{ renderArgToken(arg) }}
                    </span>
                </code>
                <div class="help-row-description">
                    {{ option.help_text }}
                    <template v-for="arg in option.args" :key="arg.name">
                        <span v-if="arg.default !== null" class="help-default">
                            {{ $t('help.default', { value: arg.default }) }}
                        </span>
                        <span v-if="arg.notice" class="help-row-note">{{ arg.notice }}</span>
                    </template>
                </div>
            </div>
        </div>
    </HelpSection>
</template>
