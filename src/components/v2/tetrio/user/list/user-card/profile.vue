<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import Avatar from '~/types/avatar';
import { calculateXpLevel } from '~/utils/xp';

const { locale } = useI18n();

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

        <shared-avatar :avatar="user.avatar" :fallback="{ type: 'identicon', hash: user.id }" class="size-12" />

        <n-flex :size="0" vertical>
            <n-text class="text-(5 current) leading-none fw-bold">
                {{ user.name }}
            </n-text>

            <n-text :depth="3" class="text-xs">{{ user.id }}</n-text>

            <n-text :depth="3" class="text-2">
                {{
                    $t('v2.tetrio.user.list.level', {
                        level: Math.trunc(calculateXpLevel(user.xp)),
                        xp: new Intl.NumberFormat(locale).format(user.xp),
                    })
                }}
            </n-text>
        </n-flex>

        <n-flex align="center" size="small" vertical>
            <template v-if="isNonNullish(props.user.country)">
                <v2-country :code="props.user.country" class="[&>img]:(h-5) rounded-sm" />
            </template>
        </n-flex>
    </n-flex>
</template>
