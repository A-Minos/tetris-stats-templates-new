<script lang="ts" setup>
import type { Component } from 'vue';
import V1Binding from '~/pages/v1/binding/index.vue';
import { Status } from '~/types/status';

const pages = ref<Component[]>([]);

onMounted(async () => {
    for (const status of Object.values(Status)) {
        window.__DATA__ = JSON.stringify({
            platform: 'TETR.IO',
            type: status,
            user: {
                avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
                name: 'SCDHH',
            },
            bot: {
                avatar: 'https://txt.osk.sh/branding/tetrio-color.png',
                name: 'NoneBot',
            },
            prompt: '__prompt__',
        });

        await nextTick();

        pages.value.push(h(V1Binding));

        await nextTick();
    }
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
