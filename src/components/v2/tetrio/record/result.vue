<script lang="ts" setup>
import { isNonNullish } from 'remeda';
import Result from '~/types/v2/tetrio/record/result';
import Statistic from '~/types/v2/tetrio/record/statistic';

const { locale, t } = useI18n();
const data = useData(Result);

defineProps<{
    readonly title: string;
    readonly resultValue: string;
    readonly statistic: Statistic;
}>();

const accent = computed(() => {
    if (data.disputed) return '#e68a8e';
    if (data.personal_best !== null) return '#f2d16b';
    return data.query.type === 'recent' ? '#7bb6df' : '#adb6c4';
});
</script>

<template>
    <article class="record-report" :style="{ '--record-accent': accent }">
        <header class="report-header">
            <div class="report-identity">
                <v2-tetrio-record-user />
                <div v-if="data.personal_best !== null || data.disputed" class="report-status">
                    <template v-if="data.personal_best !== null">
                        {{ t(`v2.tetrio.record.personal_best.${data.personal_best}`) }}
                    </template>
                    <template v-if="data.disputed">
                        {{ data.personal_best !== null ? ' · ' : '' }}{{ t('v2.tetrio.record.disputed') }}
                    </template>
                </div>
            </div>
            <div class="report-result">
                <div class="report-mode">{{ title }}</div>
                <div
                    class="report-score"
                    :class="{
                        'report-score-accent': data.personal_best !== null || data.disputed,
                        'report-score-current': data.personal_best === 'current' && !data.disputed,
                    }"
                >
                    {{ resultValue }}
                </div>
                <n-flex
                    v-if="
                        isNonNullish(data.global_rank) ||
                        (isNonNullish(data.user.country) && isNonNullish(data.country_rank))
                    "
                    justify="center"
                    align="center"
                    size="large"
                    class="report-ranks"
                >
                    <n-flex
                        v-if="isNonNullish(data.user.country) && isNonNullish(data.country_rank)"
                        align="center"
                        size="small"
                        :wrap="false"
                    >
                        <v2-country
                            :code="data.user.country"
                            :alt="data.user.country.toUpperCase()"
                            class="[&>img]:(h-4) rounded-sm"
                            preview-disabled
                        />
                        <n-text type="info"> #{{ data.country_rank }} </n-text>
                    </n-flex>
                    <n-text v-if="isNonNullish(data.global_rank)" type="success"> 🌏 #{{ data.global_rank }} </n-text>
                </n-flex>
            </div>
            <div class="report-context">
                <div>{{ t(`v2.tetrio.record.query.${data.query.type}`, { index: data.query.index }) }}</div>
                <time>{{ data.play_at.toLocaleString(locale) }}</time>
            </div>
        </header>

        <div class="report-statistics">
            <n-flex vertical size="large" class="min-w-0">
                <v2-tetrio-record-statistic-key :statistic="statistic" />
                <v2-tetrio-record-statistic-finesse :statistic="statistic" />
            </n-flex>
            <div class="min-w-0">
                <slot name="efficiency" />
            </div>
            <n-flex vertical size="large" class="min-w-0">
                <v2-tetrio-record-statistic-clear :statistic="statistic" />
                <v2-tetrio-record-statistic-max :statistic="statistic" />
            </n-flex>
        </div>

        <footer class="report-footer">
            <v2-tetrio-record-replay />
            <v2-footer compact />
        </footer>
    </article>
</template>

<style lang="scss" scoped>
.record-report {
    padding: 24px 28px 16px;
    background: #17171c;
    color: #e8ebf0;
    font-variant-numeric: tabular-nums;
}

.report-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 24px;
    margin: -24px -28px 0;
    padding: 24px 28px;
    background: color-mix(in srgb, var(--record-accent) 10%, #17171c);
}

.report-identity {
    min-width: 0;
}

.report-status {
    margin-top: 6px;
    padding-left: 76px;
    color: var(--record-accent);
    font-size: 13px;
}

.report-context {
    text-align: right;
    color: #a3a6af;
    font-size: 14px;
    line-height: 1.8;

    time {
        display: block;
        font-size: 12px;
        color: #767b88;
    }
}

.report-mode {
    color: var(--record-accent);
    font-size: 16px;
    font-weight: 600;
}

.report-result {
    text-align: center;
}

.report-score {
    font-size: 60px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.035em;
}

.report-score-accent {
    color: var(--record-accent);
}

.report-score-current {
    color: #facc15;
    text-shadow: 0 0 1rem;
}

.report-ranks {
    margin-top: 8px;
    font-size: 16px;
}

.report-statistics {
    display: grid;
    grid-template-columns: 1fr 1fr 1.2fr;
    gap: 36px;
    padding: 22px 0;
    border-top: 1px solid #ffffff12;
    font-size: 14px;
}

.report-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid #ffffff0a;
}
</style>
