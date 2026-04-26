<script lang="ts" setup>
import type { HelpNodeT } from '~/types/help';

defineProps<{
    node: HelpNodeT;
}>();
</script>

<template>
    <n-flex vertical :size="12">
        <!-- Title + aliases + description -->
        <n-card size="small">
            <n-flex align="baseline" :size="8" wrap>
                <n-text class="text-2xl" type="info" strong>{{ node.name }}</n-text>
                <n-tag v-for="alias in node.aliases" :key="alias" size="small" type="info" :bordered="false">
                    {{ alias }}
                </n-tag>
            </n-flex>
            <n-text v-if="node.help_text" depth="2" class="text-sm">{{ node.help_text }}</n-text>
        </n-card>

        <!-- Positional args -->
        <n-card v-if="node.args.filter((a) => !a.hidden).length > 0" title="参数" size="small">
            <n-table :bordered="false" :single-line="false" size="small">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>说明 / 类型</th>
                        <th>可选</th>
                        <th>默认值</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="arg in node.args.filter((a) => !a.hidden)" :key="arg.name">
                        <td>
                            <n-text code>{{ arg.name }}</n-text>
                        </td>
                        <td>
                            <span v-if="arg.notice">{{ arg.notice }}</span>
                            <n-text v-else-if="arg.type_repr" depth="3">
                                <code>{{ arg.type_repr }}</code>
                            </n-text>
                        </td>
                        <td>
                            <n-tag v-if="arg.optional" size="tiny" type="success" :bordered="false">可选</n-tag>
                            <n-tag v-else size="tiny" type="warning" :bordered="false">必填</n-tag>
                        </td>
                        <td>
                            <n-text v-if="arg.default" code>{{ arg.default }}</n-text>
                            <n-text v-else depth="3">-</n-text>
                        </td>
                    </tr>
                </tbody>
            </n-table>
        </n-card>

        <!-- Options -->
        <n-card v-if="node.options.length > 0" title="选项" size="small">
            <n-flex vertical :size="8">
                <n-card v-for="opt in node.options" :key="opt.dest" size="small" embedded>
                    <n-flex align="baseline" :size="8" wrap>
                        <n-text code class="text-base">{{ opt.name }}</n-text>
                        <n-tag v-for="a in opt.aliases" :key="a" size="tiny" :bordered="false">{{ a }}</n-tag>
                    </n-flex>
                    <n-text v-if="opt.help_text" depth="2" class="text-sm">{{ opt.help_text }}</n-text>
                    <n-flex v-if="opt.args.filter((a) => !a.hidden).length > 0" :size="8" wrap class="mt-1">
                        <n-tag
                            v-for="arg in opt.args.filter((a) => !a.hidden)"
                            :key="arg.name"
                            size="small"
                            :bordered="false"
                        >
                            <n-text code>{{ arg.name }}</n-text>
                            <span v-if="arg.notice">: {{ arg.notice }}</span>
                            <span v-else-if="arg.type_repr">: {{ arg.type_repr }}</span>
                        </n-tag>
                    </n-flex>
                </n-card>
            </n-flex>
        </n-card>

        <!-- Subcommands (one-level summary) -->
        <n-card v-if="node.subcommands.length > 0" title="子命令" size="small">
            <n-flex vertical :size="8">
                <n-card v-for="sub in node.subcommands" :key="sub.dest" size="small" embedded>
                    <n-flex align="baseline" :size="8" wrap>
                        <n-text class="text-base" type="info" strong>{{ sub.name }}</n-text>
                        <n-tag v-for="a in sub.aliases" :key="a" size="tiny" :bordered="false">{{ a }}</n-tag>
                    </n-flex>
                    <n-text v-if="sub.help_text" depth="2" class="text-sm">{{ sub.help_text }}</n-text>
                </n-card>
            </n-flex>
            <n-text depth="3" class="text-xs">
                使用 <n-text code>tstats &lt;子命令&gt; --help</n-text> 查看详情
            </n-text>
        </n-card>
    </n-flex>
</template>
