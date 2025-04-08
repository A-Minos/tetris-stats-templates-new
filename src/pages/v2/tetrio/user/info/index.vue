<script lang="ts" setup>
import { showSingleplayer } from '~/utils/show';
</script>

<template>
    <v2-layout content_class="max-w-320">
        <v2-tetrio-user-info-header />
        <v2-tetrio-user-info-role />
        <v2-tetrio-user-info-bad-standing />
        <v2-tetrio-user-info-bio />
        <n-divider class="!my-0">{{ $t('v2.tetrio.user.info.multi_player') }}</n-divider>
        <v2-tetrio-user-info-badges />
        <n-flex vertical>
            <v2-tetrio-user-info-tetra-league />
            <v2-tetrio-user-info-quick-play2 />

            <n-flex :wrap="false">
                <v2-tetrio-user-info-achievements />
                <v2-tetrio-user-info-detail />
            </n-flex>
        </n-flex>

        <n-divider v-if="showSingleplayer" class="!my-0">{{ $t('v2.tetrio.user.info.single_player') }}</n-divider>

        <n-flex :wrap="false">
            <v2-tetrio-user-info-sprint />
            <v2-tetrio-user-info-blitz />
        </n-flex>

        <v2-tetrio-user-info-zen />

        <v2-footer />
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
