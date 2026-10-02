<script lang="ts">
export type TetrominoShape = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export const tetrominoColors: Record<TetrominoShape, string> = {
    I: '#00c8e8',
    O: '#f2d649',
    T: '#b56be8',
    S: '#63d283',
    Z: '#ee6565',
    J: '#6594ed',
    L: '#f5a55c',
};

const tetrominoCells: Record<TetrominoShape, readonly (readonly [number, number])[]> = {
    I: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
    ],
    O: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
    ],
    T: [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
    ],
    S: [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
    ],
    Z: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
    ],
    J: [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
    ],
    L: [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
    ],
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        shape: TetrominoShape;
        size?: number;
    }>(),
    { size: 12 },
);

const cells = computed(() => tetrominoCells[props.shape]);
const columns = computed(() => Math.max(...cells.value.map(([x]) => x)) + 1);
const rows = computed(() => Math.max(...cells.value.map(([, y]) => y)) + 1);
const color = computed(() => tetrominoColors[props.shape]);
</script>

<template>
    <svg
        :width="columns * props.size"
        :height="rows * props.size"
        :viewBox="`0 0 ${columns} ${rows}`"
        aria-hidden="true"
        focusable="false"
    >
        <rect
            v-for="([x, y], index) in cells"
            :key="index"
            :x="x + 0.04"
            :y="y + 0.04"
            width="0.92"
            height="0.92"
            :fill="color"
            stroke="#000"
            stroke-opacity="0.16"
            stroke-width="0.03"
        />
    </svg>
</template>
