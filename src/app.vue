<script setup lang="ts">
if (!import.meta.env.DEV) {
    useHead({
        script: [
            {
                innerHTML: 'window.__DATA__ = {{ data | tojson }};',
                type: 'text/javascript',
            },
        ],
    });
}
</script>

<template>
    <NuxtLayout>
        <NuxtLoadingIndicator />
        <NuxtPage />
    </NuxtLayout>
</template>
