<script lang="ts" setup>
import type { Component } from 'vue';

const props = defineProps<{
    readonly pages: readonly Component[];
}>();

const { setLocale } = useI18n();
</script>

<template>
    <div>
        <template v-for="(page, index) in props.pages" :key="index">
            <Component :is="page" />
        </template>

        <div class="fixed bottom-4 right-4 z-9999 flex gap-2">
            <button
                class="cursor-pointer rounded-2 border-none bg-black/60 px-3 py-1.5 text-sm text-white/80 shadow backdrop-blur-sm hover:bg-black/80"
                @click="setLocale('zh-CN')"
            >
                zh-CN
            </button>
            <button
                class="cursor-pointer rounded-2 border-none bg-black/60 px-3 py-1.5 text-sm text-white/80 shadow backdrop-blur-sm hover:bg-black/80"
                @click="setLocale('en-US')"
            >
                en-US
            </button>
        </div>
    </div>
</template>
