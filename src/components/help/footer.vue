<template>
    <footer class="help-footer flex flex-col items-center gap-0.5 pt-[18px] text-[13px]">
        <i18n-t keypath="v2.footer.powered_by" tag="span" scope="global">
            <template #product>
                <span class="help-footer-product font-bold">NoneBot2 x nonebot-plugin-tetris-stats</span>
            </template>
        </i18n-t>
    </footer>
</template>

<style scoped>
.help-footer {
    border-top: 1px solid var(--help-line);
    color: var(--help-text-3);
}

.help-footer-product {
    color: var(--help-accent);
}
</style>
