<script setup lang="ts">
import Identicon from 'identicon.js';
import { isString } from 'remeda';
import type Avatar from '~/types/avatar';
import type IdenticonType from '~/types/identicon';

const props = defineProps<{
    avatar: Avatar;
}>();

function generateIdenticon(avatar: IdenticonType) {
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

function getAvatar(avatar: Avatar) {
    if (isString(avatar)) {
        return avatar;
    }
    if (avatar.hash) {
        return generateIdenticon(avatar);
    }
}
</script>

<template>
    <img :src="getAvatar(avatar)" alt="头像" />
</template>
