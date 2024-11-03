<script lang="ts">
export enum Status {
    SUCCESS = 'success',
    UNVERIFIED = 'unverified',
    UNKNOWN = 'unknown',
    UNBIND = 'unbind',
    ERROR = 'error',
}
</script>

<script lang="ts" setup>
const data = useData<{
    readonly type: Status;
}>();
</script>

<template>
    <template v-if="data.type === Status.SUCCESS">
        <v1-binding-status-success />
    </template>

    <template v-if="data.type === Status.UNVERIFIED">
        <v1-binding-status-warning />
    </template>

    <template v-if="data.type === Status.UNKNOWN">
        <v1-binding-status-question />
    </template>

    <template v-if="data.type === Status.UNBIND">
        <v1-binding-status-unbind />
    </template>

    <template v-if="data.type === Status.ERROR">
        <v1-binding-status-error />
    </template>
</template>
