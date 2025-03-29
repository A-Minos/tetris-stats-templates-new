<script lang="ts" setup>
import z from 'zod';
import { Status } from '~/types/status';

const data = useData(
    z
        .object({
            type: z.nativeEnum(Status),
        })
        .readonly(),
);
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
