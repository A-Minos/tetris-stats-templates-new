import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

export default defineNuxtConfig({
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
            generatedLocaleFilePathFormat: 'relative',
        },
    },

    vite: {
        plugins: [
            AutoImport({
                imports: [
                    {
                        'naive-ui': ['useDialog', 'useMessage', 'useModal', 'useNotification', 'useLoadingBar'],
                    },
                ],
            }),
            Components({
                resolvers: [NaiveUiResolver()],
            }),
        ],
    },

    app: {
        head: {
            script: [
                {
                    innerHTML: `window.__DATA__ = {{ data | tojson }};`,
                    type: 'text/javascript',
                },
                {
                    innerHTML: `window.__PATH__ = '{{ path }}';`,
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

    compatibilityDate: '2024-11-04',

    devtools: {
        timeline: {
            enabled: true,
        },
    },
});
