<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core';
import rgbaster from 'rgbaster-plus';
import { ValidRank } from '~/types/rank';

const props = defineProps<{
    readonly name: ValidRank;
}>();

const icon = asyncComputed(async () => {
    return await import(`~/assets/images/rank/${props.name}.svg?url`).then((module) => {
        return module.default;
    });
});

const color = asyncComputed(async () => {
    if (!icon.value) {
        return undefined;
    }

    const pixels = await rgbaster(icon.value);
    const primaryColor = pixels[0]?.color;

    if (!primaryColor) {
        throw new Error(`Cannot extract primary rank color for ${props.name}.`);
    }

    const rgb = primaryColor
        .match(/\(([^)]+)\)/)?.[1]
        ?.split(',')
        .slice(0, 3);

    if (!rgb || rgb.length < 3) {
        throw new Error(`Invalid rgbaster color format for ${props.name}: ${primaryColor}`);
    }

    const [r, g, b] = rgb.map((value) => value.trim());

    return `rgba(${r}, ${g}, ${b}, 0.5)`;
});
</script>

<template>
    <n-card :style="{ backgroundColor: color }">
        <slot />
    </n-card>
</template>
