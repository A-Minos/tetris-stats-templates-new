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
            :keypath="`v1.tos.info.single.title`"
            tag="span"
            class="font-template text-8.75 fw-900 color-[#000000]"
        ></i18n-t>

        <div class="mt-3.75">
            <div ref="container" class="grid grid-cols-2 gap-6.25">
                <v1-tos-info-card-40l />
                <v1-tos-info-card-challenge />
                <v1-tos-info-card-marathon />
            </div>
        </div>
    </template>
</template>
