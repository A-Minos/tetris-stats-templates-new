import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { NuxtPage } from '@nuxt/schema';
import Languages, { languageNames } from './src/constants/enum/languages';
import type { Language } from './src/constants/enum/languages';

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
function flattenMessages(value: unknown, locale: Language, path: string[] = []): Record<string, string> {
    if (typeof value === 'string') return { [path.join('.')]: value };

    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new TypeError(`[i18n] ${locale}: "${path.join('.') || '<root>'}" must be a string or object`);
    }

    const result: Record<string, string> = {};
    for (const [key, child] of Object.entries(value)) {
        Object.assign(result, flattenMessages(child, locale, [...path, key]));
    }
    return result;
}

function placeholders(message: string): string[] {
    return [...message.matchAll(/\{([^{}]+)\}/g)].map((match) => match[1]!).sort();
}

function validateMessages(
    locale: Language,
    reference: Record<string, string>,
    candidate: Record<string, string>,
): void {
    const missing = Object.keys(reference).filter((key) => !(key in candidate));
    const extra = Object.keys(candidate).filter((key) => !(key in reference));
    if (missing.length || extra.length) {
        throw new Error(
            `[i18n] ${locale}: message keys differ from zh-CN` +
                `${missing.length ? `; missing: ${missing.join(', ')}` : ''}` +
                `${extra.length ? `; extra: ${extra.join(', ')}` : ''}`,
        );
    }

    for (const [key, referenceMessage] of Object.entries(reference)) {
        const expected = placeholders(referenceMessage);
        const actual = placeholders(candidate[key]!);
        if (expected.join('\0') !== actual.join('\0')) {
            throw new Error(
                `[i18n] ${locale}: placeholders for "${key}" differ from zh-CN; ` +
                    `expected {${expected.join('}, {')}}, received {${actual.join('}, {')}}`,
            );
        }
    }
}

function discoverLocales() {
    const localeDir = join(import.meta.dirname, 'i18n', 'locales');
    const files = readdirSync(localeDir)
        .filter((file) => file.endsWith('.json'))
        .map((file) => [file.slice(0, -'.json'.length), file] as const);

    for (const [code] of files) {
        if (!(Languages as readonly string[]).includes(code)) {
            throw new Error(`[i18n] unsupported locale file: ${code}.json`);
        }
    }

    const messages: Partial<Record<Language, Record<string, string>>> = {};
    for (const [code, file] of files) {
        const locale = code as Language;
        const value = JSON.parse(readFileSync(join(localeDir, file), 'utf8')) as unknown;
        messages[locale] = flattenMessages(value, locale);
    }

    const reference = messages['zh-CN'];
    if (!reference) throw new Error('[i18n] missing canonical locale file: zh-CN.json');

    for (const locale of Languages) {
        const candidate = messages[locale];
        if (candidate) validateMessages(locale, reference, candidate);
    }

    return Languages.filter((code) => messages[code] !== undefined).map((code) => ({
        code,
        name: languageNames[code],
        file: `${code}.json`,
    }));
}

const locales = discoverLocales();

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
        locales,
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
