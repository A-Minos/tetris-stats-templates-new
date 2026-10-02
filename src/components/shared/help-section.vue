<script lang="ts" setup>
defineProps<{
    readonly title: string;
}>();
</script>

<template>
    <section class="help-section">
        <h2 class="help-section-label">{{ title }}</h2>
        <slot />
    </section>
</template>
