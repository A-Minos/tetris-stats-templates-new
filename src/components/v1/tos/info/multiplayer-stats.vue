<script lang="ts" setup>
import { isNonNullish } from 'remeda';

const container = ref<HTMLDivElement>();

const valid = ref(true);

onMounted(() => {
    valid.value = isNonNullish(container.value) && container.value.childElementCount > 0;
});
</script>

<template>
    <template v-if="valid">
        <i18n-t
            :keypath="`v1.tos.info.multi.title`"
            tag="span"
            class="font-template text-8.75 fw-900 color-[#000000]"
        ></i18n-t>

        <div class="mt-3.75">
            <div ref="container" class="flex gap-6.25">
                <div class="flex flex-col gap-6.25">
                    <v1-tos-info-card-lpm />
                    <v1-tos-info-card-apm />
                    <v1-tos-info-card-adpm />
                </div>

                <v1-tos-info-chart-radar />
            </div>
        </div>
    </template>
</template>
