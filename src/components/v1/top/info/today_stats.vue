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
            :keypath="`v1.top.info.today.title`"
            tag="span"
            class="font-template text-8.75 fw-900 color-[#000000]"
        ></i18n-t>

        <div class="mt-3.75">
            <div ref="container" class="flex gap-6.25">
                <v1-top-info-card-lpm _key="today" />
                <v1-top-info-card-apm _key="today" />
            </div>
        </div>
    </template>
</template>
