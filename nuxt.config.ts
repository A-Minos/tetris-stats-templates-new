export default defineNuxtConfig({
    ssr: false,
    srcDir: 'src',
    modules: ['@unocss/nuxt', '@nuxtjs/i18n'],

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
