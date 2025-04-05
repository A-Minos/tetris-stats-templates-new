<script setup lang="ts">
import { isNonNullish } from 'remeda';
import { getAvatar } from '~/components/shared/avatar.vue';
import Avatar from '~/types/avatar';
import { calculateXpLevel } from '~/utils/xp';

const props = defineProps<{
    readonly index: number | null;

    readonly user: {
        readonly id: string;
        readonly name: string;
        readonly avatar: Avatar;
        readonly country: string | null;
        readonly xp: number;
    };
}>();
</script>

<template>
    <n-flex align="center" size="small">
        <n-text v-if="isNonNullish(index)" class="text-4 fw-bold" type="info">#{{ index }}</n-text>

        <n-image :img-props="{ class: 'size-12' }" :src="getAvatar(user.avatar)" />

        <n-flex :size="0" vertical>
            <n-text class="text-(5 current) leading-none fw-bold">
                {{ user.name }}
            </n-text>

            <n-text :depth="3" class="text-xs">{{ user.id }}</n-text>

            <n-text :depth="3" class="text-2">
                {{ Math.trunc(calculateXpLevel(user.xp)) }} 级 ({{ new Intl.NumberFormat('zh-CN').format(user.xp) }} XP)
            </n-text>
        </n-flex>

        <n-flex align="center" size="small" vertical>
            <template v-if="isNonNullish(props.user.country)">
                <v2-country :code="props.user.country" class="[&>img]:(h-5) rounded-sm" />
            </template>
        </n-flex>
    </n-flex>
</template>
