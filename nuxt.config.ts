export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4,
    },

    ssr: false,
    srcDir: 'src',
    modules: ['@unocss/nuxt', '@nuxtjs/i18n', ['@bg-dev/nuxt-naiveui', { colorModePreference: 'dark-only' }]],

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
        head: {
            script: [
                {
                    innerHTML: 'window.__DATA__ = {{ data | tojson }};',
                    type: 'text/javascript',
                },
            ],
        },
        cdnURL: './',
    },

    router: {
        options: {
            hashMode: true,
        },
    },

    sourcemap: {
        client: true,
        server: true,
    },

    compatibilityDate: '2024-11-04',

    devtools: {
        timeline: {
            enabled: true,
        },
    },

    vite: {
        build: {
            sourcemap: true,
        },
    },
});
