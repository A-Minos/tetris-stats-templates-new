<script lang="ts" setup>
useLang();
</script>

<template>
    <div id="content" class="w-fit bg-[#f1f1f1] px-6.25">
        <div class="mt-5.5">
            <v1-tos-info-account-rankings />
        </div>

        <div class="mt-10.75">
            <v1-tos-info-multiplayer-stats />
        </div>

        <div class="mt-10.75">
            <v1-tos-info-singleplayer-stats />
        </div>

        <v1-footer />
    </div>
</template>

<style lang="scss">
@use '~/styles/v1';
</style>
