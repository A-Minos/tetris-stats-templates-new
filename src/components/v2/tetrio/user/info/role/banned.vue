<template>
    <n-alert :show-icon="false" type="error">
        <div class="text-center">
            <n-flex :size="0" vertical>
                <n-text class="text-5xl fw-bold">{{ $t('v2.tetrio.user.info.status.banned') }}</n-text>
            </n-flex>
        </div>
    </n-alert>
</template>
