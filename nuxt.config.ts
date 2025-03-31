export default defineNuxtConfig({
    ssr: false,
    srcDir: 'src',
    modules: ['@unocss/nuxt', '@nuxtjs/i18n', 'nuxt-zod-i18n'],

    app: {
        head: {
            script: [
                {
                    innerHTML: `window.__DATA__ = '{{ DATA }}';`,
                    type: 'text/javascript',
                },
            ],
        },
    },
    router: {
        options: {
            hashMode: true,
        },
    },

    i18n: {
        vueI18n: './i18n.config.ts',
    },

    compatibilityDate: '2024-11-04',
});
