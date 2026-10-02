<script lang="ts" setup>
import HelpPage from '~/pages/help.vue';
import { useDevPage } from '~/dev-pages/useDevPage';
import samples from './samples.json';

const { pages, addPage } = useDevPage();
const { locale } = useI18n();

onMounted(() => {
    watch(
        locale,
        async (language) => {
            pages.value = [];
            await nextTick();
            for (const data of Object.values(samples[language])) {
                await addPage(data, HelpPage);
            }
        },
        { immediate: true },
    );
});
</script>

<template>
    <test-layout :pages="pages" />
</template>
