<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import { z } from 'zod';
import Zenith from '~/types/zenith';

const data = useData(
    z
        .object({
            user: z.object({
                country: z.string().nullable(),
            }),

            zenith: Zenith.nullable(),

            zenithex: Zenith.nullable(),
        })
        .readonly(),
);
</script>

<template>
    <n-flex :wrap="false" v-if="isNonNullish(data.zenith) || isNonNullish(data.zenithex)">
        <v2-tetrio-user-info-quick-play2-card
            v-if="isNonNullish(data.zenith)"
            :country="data.user.country"
            :week="data.zenith.week"
            :best="data.zenith.best"
            :mods="[]"
        />
        <v2-tetrio-user-info-quick-play2-card
            v-if="isNonNullish(data.zenithex)"
            :country="data.user.country"
            :week="data.zenithex.week"
            :best="data.zenithex.best"
            :mods="['expert']"
        />
    </n-flex>
</template>
