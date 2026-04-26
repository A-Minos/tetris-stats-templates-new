<script lang="ts" setup>
import { HelpData } from '~/types/help';
import HelpView from '~/components/shared/help-view.vue';

const data = useData(HelpData);

useLang();
</script>

<template>
    <v2-layout content_class="max-w-200">
        <n-card size="small">
            <n-text depth="2" class="text-sm">{{ data.breadcrumb.join(' › ') }}</n-text>
        </n-card>
        <HelpView :node="data.command" />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
