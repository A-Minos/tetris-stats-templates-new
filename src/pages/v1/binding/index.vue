<script lang="ts" setup>
useLang();
</script>

<template>
    <div id="content" class="w-fit bg-[#f1f1f1] p-7.5">
        <div class="flex flex-col gap-3.75">
            <v1-binding-header />

            <div class="mt-3.75">
                <v1-binding-main />
            </div>

            <v1-binding-footer />
        </div>
    </div>
</template>

<style lang="scss">
@use '~/styles/v1';
</style>
