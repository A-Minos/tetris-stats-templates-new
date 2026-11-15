<script lang="ts" setup>
defineProps<{
    readonly title: string;
}>();
</script>

<template>
    <section class="flex flex-col gap-3">
        <h2
            class="flex items-center gap-[10px] m-0 text-[14px] font-500 tracking-[0.06em] text-[var(--help-text-2)] before:content-[''] before:w-2 before:h-2 before:rounded-[1px] before:bg-[var(--help-accent)]"
        >
            {{ title }}
        </h2>
        <slot />
    </section>
</template>
