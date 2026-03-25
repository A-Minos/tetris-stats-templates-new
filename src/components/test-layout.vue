<script lang="ts" setup>
import type { Component } from 'vue';

const props = defineProps<{
    readonly pages: readonly Component[];
}>();

const { setLocale } = useI18n();
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-12 bg-[#2b2b36] p-12 min-h-screen isolate">
        <div
            v-for="(page, index) in props.pages"
            :key="index"
            class="relative border-2 border-dashed border-white/30 rounded p-0 w-max"
        >
            <Component :is="page" class="relative block h-max !static" />
        </div>

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
