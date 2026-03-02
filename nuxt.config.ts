export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4,
    },

    ssr: false,
    srcDir: 'src',
    modules: ['@unocss/nuxt', '@nuxtjs/i18n', 'nuxt-zod-i18n', 'nuxtjs-naive-ui'],

    i18n: {
        defaultLocale: 'zh-CN',
        strategy: 'no_prefix',
        locales: [
            { code: 'en-US', name: 'English', file: 'en-US.json' },
            { code: 'zh-CN', name: 'Chinese', file: 'zh-CN.json' },
        ],
        detectBrowserLanguage: false,
        experimental: {
            typedOptionsAndMessages: 'default',
        },
    },

    app: {
        cdnURL: './',
    },

    router: {
        options: {
            hashMode: true,
        },
    },

    compatibilityDate: '2024-11-04',

    devtools: {
        timeline: {
            enabled: true,
        },
    },
});
