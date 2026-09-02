<template>
    <n-card size="small">
        <div class="text-center">
            <n-text class="text-2xl fw-bold" type="warning">
                {{
                    $t('v2.footer.powered_by', {
                        product: 'NoneBot2 x nonebot-plugin-tetris-stats',
                    })
                }}
            </n-text>

            <br />

            <n-text :depth="3" class="text-xs">
                {{
                    $t('v2.footer.designed_by', {
                        designer: 'WOSHIZHAZHA120',
                        framework: 'Naive UI',
                    })
                }}
            </n-text>
        </div>
    </n-card>
</template>
