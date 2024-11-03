<script lang="ts" setup>
import { Status } from '~/components/v1/binding/status/index.vue';

const data = useData<{
    readonly type: Status;
}>();
</script>

<template>
    <template v-if="data.type === Status.SUCCESS">
        <v1-binding-footer-success />
    </template>

    <template v-if="data.type === Status.UNVERIFIED">
        <v1-binding-footer-warning />
    </template>

    <template v-if="data.type === Status.UNKNOWN">
        <v1-binding-footer-question />
    </template>

    <template v-if="data.type === Status.UNBIND">
        <v1-binding-footer-unbind />
    </template>

    <template v-if="data.type === Status.ERROR">
        <v1-binding-footer-error />
    </template>
</template>
