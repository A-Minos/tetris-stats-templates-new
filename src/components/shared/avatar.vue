<script lang="ts" setup>
import type Avatar from '~/types/avatar';

const props = defineProps<{
    avatar: Avatar;
    fallback?: IdenticonType;
}>();

const source = computed(() => getAvatar(props.avatar));
const failed = ref(false);
watch(source, () => (failed.value = false));

const displaySource = computed(() => (failed.value && props.fallback ? getAvatar(props.fallback) : source.value));

function onError() {
    if (typeof props.avatar === 'string' && props.fallback) {
        failed.value = true;
    }
}
</script>

<script lang="ts">
import Identicon from 'identicon.js';
import { isString } from 'remeda';
import type IdenticonType from '~/types/identicon';

function generateIdenticon(avatar: IdenticonType): string {
    return (
        'data:image/svg+xml;base64,' +
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
    <img :key="displaySource" :src="displaySource" :alt="$t('common.avatar_alt')" @error="onError" />
</template>
