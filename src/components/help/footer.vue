<template>
    <footer class="help-footer">
        <i18n-t keypath="v2.footer.powered_by" tag="span" scope="global">
            <template #product>
                <span class="help-footer-product">NoneBot2 x nonebot-plugin-tetris-stats</span>
            </template>
        </i18n-t>
    </footer>
</template>

<style lang="scss" scoped>
.help-footer {
    @apply flex flex-col items-center gap-0.5 pt-[18px];
    border-top: 1px solid var(--help-line);
    font-size: 13px;
    color: var(--help-text-3);
}

.help-footer-product {
    font-weight: 700;
    color: var(--help-accent);
}
</style>
