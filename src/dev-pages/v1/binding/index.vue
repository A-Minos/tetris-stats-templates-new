<script lang="ts" setup>
import V1Binding from '~/pages/v1/binding/index.vue';
import { Status } from '~/types/status';
import { useDevPage } from '~/dev-pages/useDevPage';

const { pages, addPage } = useDevPage();

onMounted(async () => {
    for (const status of Object.values(Status)) {
        await addPage(
            {
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
            },
            V1Binding,
        );
    }
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
