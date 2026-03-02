<script setup lang="ts">
useHead({
    script: [
        {
            innerHTML: 'window.__DATA__ = {{ data | tojson }};',
            type: 'text/javascript',
        },
    ],
});
</script>

<template>
    <NuxtLayout>
        <NuxtLoadingIndicator />
        <NuxtPage />
    </NuxtLayout>
</template>
