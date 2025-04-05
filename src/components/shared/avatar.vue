<script setup lang="ts">
import type Avatar from '~/types/avatar';

defineProps<{
    avatar: Avatar;
}>();
</script>

<script lang="ts">
import Identicon from 'identicon.js';
import { isString } from 'remeda';
import type IdenticonType from '~/types/identicon';

function generateIdenticon(avatar: IdenticonType): string {
    return (
        'data:image/svg+xmlbase64,' +
        new Identicon(avatar.hash, {
            background: [8, 10, 6, 255],
            margin: 0.15,
            size: 300,
            brightness: 0.48,
            saturation: 0.65,
            format: 'svg',
        }).toString()
    );
}

export function getAvatar(avatar: Avatar): string {
    if (isString(avatar)) {
        return avatar;
    }

    return generateIdenticon(avatar);
}
</script>

<template>
    <img :src="getAvatar(avatar)" alt="头像" />
</template>
