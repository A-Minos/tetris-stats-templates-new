<template>
    <footer
        class="border-t-1 border-t-solid border-[var(--help-line)] text-[var(--help-text-3)] flex flex-col items-center gap-0.5 pt-[18px] text-[13px]"
    >
        <i18n-t keypath="v2.footer.powered_by" tag="span" scope="global">
            <template #product>
                <span class="text-[var(--help-accent)] font-bold">NoneBot2 x nonebot-plugin-tetris-stats</span>
            </template>
        </i18n-t>
    </footer>
</template>
