export default defineNuxtConfig({
    ssr: false,
    srcDir: 'src',
    modules: ['@unocss/nuxt', '@nuxtjs/i18n'],
    router: {
        options: {
            hashMode: true,
        },
    },
});
