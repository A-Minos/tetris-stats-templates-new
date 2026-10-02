<script lang="ts" setup>
import type { HelpNode } from '~/types/help';
import { helpGames } from '~/constants/help-games';
import Tetromino from '~/components/shared/tetromino.vue';

const props = defineProps<{
    readonly command: HelpNode;
    readonly breadcrumb: string[];
}>();
const games = computed(() =>
    props.breadcrumb.length === 1 ? props.command.subcommands.map((game) => game.name) : [props.breadcrumb[1]!],
);
</script>

<template>
    <div class="relative overflow-hidden rounded p-2.5">
        <div class="pointer-events-none absolute right-20 top-0 flex items-center gap-6 opacity-8" aria-hidden="true">
            <Tetromino shape="T" :size="36" class="rotate-12" />
            <Tetromino shape="S" :size="30" class="-rotate-12 translate-y-5" />
            <Tetromino shape="L" :size="32" class="rotate-25 -translate-y-3" />
        </div>
        <n-flex align="center" justify="space-between" class="relative">
            <n-flex vertical size="small">
                <n-text class="text-6 fw-bold help-title leading-none">{{ command.name }}</n-text>
                <n-text v-if="command.aliases.length" :depth="3" class="text-xs">
                    {{ command.aliases.join(' / ') }}
                </n-text>
                <n-text v-if="command.help_text" :depth="2">{{ command.help_text }}</n-text>
            </n-flex>
            <n-flex size="small">
                <n-flex v-for="game in games" :key="game" :size="4" align="center" class="rounded bg-black/50 p-2">
                    <img
                        v-if="helpGames[game]?.logo"
                        :src="helpGames[game].logo"
                        class="size-4 object-contain"
                        alt=""
                    />
                    <n-text class="text-white fw-bold help-title">{{ game }}</n-text>
                </n-flex>
            </n-flex>
        </n-flex>
    </div>
</template>
