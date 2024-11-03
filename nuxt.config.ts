export default defineNuxtConfig({
    ssr: false,
    srcDir: 'src',
    modules: ['@unocss/nuxt'],
    router: {
        options: {
            hashMode: true,
        },
    },
});
