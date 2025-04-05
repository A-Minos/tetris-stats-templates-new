<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core';
import rgbaster from 'rgbaster-plus';
import { ValidRank } from '~/types/rank';

const props = defineProps<{
    readonly name: ValidRank;
}>();

const icon = asyncComputed(async () => {
    return await import(`~/assets/images/ranks/${props.name.toLowerCase()}.svg?url`).then((module) => {
        return module.default;
    });
});

const color = asyncComputed(async () => {
    const pixels = await rgbaster(icon.value);
    const [r, g, b] = pixels[0].color.split('(')[1].split(')')[0].split(',').slice(0, 3);

    return `rgba(${r}, ${g}, ${b}, 0.5)`;
});
</script>

<template>
    <n-card :style="{ backgroundColor: color }">
        <slot />
    </n-card>
</template>
