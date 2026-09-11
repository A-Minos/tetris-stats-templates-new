<script lang="ts">
import { z } from 'zod';
import Statistic from '~/types/v2/tetrio/record/statistic';

const BlitzStatistic = Statistic.extend({ spp: z.number(), level: z.number() });
type BlitzStatistic = z.infer<typeof BlitzStatistic>;

export { BlitzStatistic };
</script>

<script lang="ts" setup>
const { locale } = useI18n();

const data = useData(
    z
        .object({
            statistic: BlitzStatistic,
        })
        .readonly(),
);

useLang();
</script>

<template>
    <v2-layout content_class="max-w-320">
        <v2-tetrio-record-result
            title="Blitz"
            :result-value="new Intl.NumberFormat(locale).format(data.statistic.score)"
            :statistic="data.statistic"
        >
            <template #efficiency>
                <v2-tetrio-record-blitz-statistic-block :statistic="data.statistic" />
            </template>
        </v2-tetrio-record-result>
    </v2-layout>
</template>

<style lang="scss">
@use '~/styles/v2';
</style>
