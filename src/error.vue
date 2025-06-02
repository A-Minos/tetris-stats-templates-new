<script lang="ts" setup>
import type { NuxtError } from '#app';

defineProps({
    error: Object as () => NuxtError,
});

useLang();
</script>

<template>
    <div id="content" class="relative bg-black text-white size-screen">
        <div class="absolute top-1/2 left-1/2 -translate-1/2">
            <div class="flex flex-col gap-5">
                <span class="text-3xl fw-bold">
                    {{ $t('error.title') }}
                </span>

                <span class="text-xl text-red">{{ error.message }}</span>

                <span class="text-xs whitespace-pre line-clamp-15">{{ error.stack }}</span>
            </div>
        </div>
    </div>
</template>
