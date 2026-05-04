<script lang="ts" setup>
import type { HelpNodeT } from '~/types/help';

const props = defineProps<{
    node: HelpNodeT;
    /** Full breadcrumb to the current node, used to synthesize a usage line. */
    breadcrumb: string[];
}>();

const visibleArgs = computed(() => props.node.args);
const visibleOptions = computed(() => props.node.options);
const visibleSubcommands = computed(() => props.node.subcommands);

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
    for (const seg of props.breadcrumb) tokens.push({ text: seg, kind: 'path' });
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
</script>

<template>
    <div class="help-view">
        <!-- Hero: title + aliases + description -->
        <header class="hero">
            <div class="title-row">
                <h1 class="title">{{ node.name }}</h1>
                <span v-for="alias in trimAliases(node.aliases)" :key="alias" class="alias">
                    {{ alias }}
                </span>
            </div>
            <p v-if="node.help_text" class="desc">{{ node.help_text }}</p>
        </header>

        <!-- USAGE code block -->
        <section class="section">
            <div class="section-label">USAGE</div>
            <pre class="code-block"><span
                v-for="(t, i) in usageTokens"
                :key="i"
                :class="['tok', `tok-${t.kind}`]"
            >{{ i === 0 ? '' : ' ' }}{{ t.text }}</span></pre>
        </section>

        <!-- ARGUMENTS -->
        <section v-if="visibleArgs.length > 0" class="section">
            <div class="section-label">ARGUMENTS</div>
            <div class="rows">
                <div v-for="arg in visibleArgs" :key="arg.name" class="row">
                    <div class="row-key">
                        <span :class="['tok', arg.optional ? 'tok-optional' : 'tok-required']">
                            {{ renderArgToken(arg.name, arg.optional) }}
                        </span>
                    </div>
                    <div class="row-val">
                        <span>{{ arg.notice || arg.type_repr || '' }}</span>
                        <span v-if="arg.default" class="muted small">默认 {{ arg.default }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- OPTIONS -->
        <section v-if="visibleOptions.length > 0" class="section">
            <div class="section-label">OPTIONS</div>
            <div class="rows">
                <div v-for="opt in visibleOptions" :key="opt.dest" class="row">
                    <div class="row-key">
                        <span class="tok tok-flag">{{ opt.name }}</span>
                        <template v-if="trimAliases(opt.aliases).length">
                            <span class="muted small">,</span>
                            <span class="tok tok-flag-alt">
                                {{ trimAliases(opt.aliases).join(', ') }}
                            </span>
                        </template>
                        <template v-for="arg in opt.args" :key="arg.name">
                            <span :class="['tok', arg.optional ? 'tok-optional' : 'tok-required']">
                                {{ renderArgToken(arg.name, arg.optional) }}
                            </span>
                        </template>
                    </div>
                    <div class="row-val">{{ opt.help_text || '' }}</div>
                </div>
            </div>
        </section>

        <!-- SUBCOMMANDS -->
        <section v-if="visibleSubcommands.length > 0" class="section">
            <div class="section-label">SUBCOMMANDS</div>
            <div class="rows">
                <div v-for="sub in visibleSubcommands" :key="sub.dest" class="row">
                    <div class="row-key">
                        <span class="tok tok-sub">{{ sub.name }}</span>
                        <span v-if="trimAliases(sub.aliases).length" class="muted small">
                            {{ trimAliases(sub.aliases).join(', ') }}
                        </span>
                    </div>
                    <div class="row-val">{{ sub.help_text || '' }}</div>
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.help-view {
    display: flex;
    flex-direction: column;
    gap: 32px;
    color: #e6edf3;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.hero {
    .title-row {
        display: flex;
        align-items: baseline;
        gap: 12px;
        flex-wrap: wrap;
    }
    .title {
        font-size: 36px;
        font-weight: 700;
        margin: 0;
        letter-spacing: -0.01em;
        color: #f0f6fc;
    }
    .alias {
        font-size: 13px;
        color: #7d8590;
        font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
    }
    .desc {
        margin: 8px 0 0;
        font-size: 16px;
        color: #8b949e;
        line-height: 1.6;
    }
}

.section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #7d8590;
}

.code-block {
    margin: 0;
    padding: 14px 18px;
    background: #161b22;
    border-radius: 6px;
    font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
    font-size: 15px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
}

.rows {
    display: flex;
    flex-direction: column;
}

.row {
    display: grid;
    grid-template-columns: minmax(180px, max-content) 1fr;
    gap: 24px;
    padding: 12px 0;
    border-top: 1px solid #21262d;
    align-items: baseline;

    &:first-child {
        border-top: none;
        padding-top: 4px;
    }
}

.row-key {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px;
    font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
    font-size: 14px;
}

.row-val {
    font-size: 15px;
    color: #b1bac4;
    line-height: 1.6;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: baseline;
}

.tok {
    font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
}
.tok-path {
    color: #e6edf3;
    font-weight: 500;
}
.tok-required {
    color: #f85149;
}
.tok-optional {
    color: #7d8590;
}
.tok-flag {
    color: #58a6ff;
    font-weight: 500;
}
.tok-flag-alt {
    color: #58a6ff;
    opacity: 0.75;
}
.tok-sub {
    color: #f0f6fc;
    font-weight: 600;
}

.muted {
    color: #7d8590;
}
.small {
    font-size: 13px;
}
</style>
