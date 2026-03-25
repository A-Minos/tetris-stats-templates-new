import { existsSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { NuxtPage } from '@nuxt/schema';

function walkVueFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) return walkVueFiles(fullPath);
        if (entry.isFile() && entry.name.endsWith('.vue')) return [fullPath];
        return [];
    });
}

function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
    for (let i = pages.length - 1; i >= 0; i--) {
        const page = pages[i]!;
        if (page.file && pattern.test(page.file)) {
            pages.splice(i, 1);
        } else {
            removePagesMatching(pattern, page.children);
        }
    }
}

function createDevPages(): NuxtPage[] {
    const devPagesDir = join(import.meta.dirname, 'src', 'dev-pages');
    if (!existsSync(devPagesDir)) return [];

    return walkVueFiles(devPagesDir)
        .sort()
        .map((file) => {
            const relativePath = relative(devPagesDir, file).split(sep).join('/');
            const routePath = relativePath
                .replace(/\.vue$/, '')
                .split('/')
                .filter((segment) => segment !== 'index')
                .join('/');

            return {
                name: `dev/${routePath || 'index'}`,
                path: routePath ? `/dev/${routePath}` : '/dev',
                file: `~/dev-pages/${relativePath}`,
            } satisfies NuxtPage;
        });
}

export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4,
    },

    ssr: false,
    srcDir: 'src',
    modules: ['@unocss/nuxt', '@nuxtjs/i18n', ['@bg-dev/nuxt-naiveui', { colorModePreference: 'dark-only' }]],

    hooks: {
        'pages:extend'(pages) {
            removePagesMatching(/\/test\.vue$/, pages);

            if (process.env.NODE_ENV !== 'production') {
                pages.push(...createDevPages());
            }
        },
    },

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
