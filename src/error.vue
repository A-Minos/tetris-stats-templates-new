<script setup lang="ts">
import type { NuxtError } from '#app';
import { darkTheme } from 'naive-ui';
import hljs from 'highlight.js/lib/common';

type StackFrame = Readonly<{
    raw: string;
    url: string;
    line: number;
    column: number;
    displayPath: string;
}>;

type CodeRow = Readonly<{
    lineNumber: number;
    html: string;
}>;

const props = defineProps<{
    error?: NuxtError;
}>();

useLang();

const route = useRoute();

const errorPageSource = 'src/error.vue';

const stackText = computed(() => props.error?.stack ?? '');

const stackRows = computed((): CodeRow[] => {
    return buildPlainRows(stackText.value, 1);
});

const frames = computed(() => parseStack(stackText.value));

const primaryFrame = computed((): StackFrame | undefined => {
    const list = frames.value;
    return list.find((f) => f.displayPath.startsWith('src/')) ?? list[0];
});

const primaryLocationText = computed(() => {
    const frame = primaryFrame.value;
    if (!frame) {
        return '';
    }
    return `${frame.displayPath}:${frame.line}:${frame.column}`;
});

const snippetErrorLine = computed((): number | null => {
    const frame = primaryFrame.value;
    if (!frame || !snippet.code) {
        return null;
    }
    if (frame.line < snippet.startLine || frame.line > snippet.endLine) {
        return null;
    }
    return frame.line;
});

const errorRowStyle = {
    backgroundColor: 'rgba(240, 68, 68, 0.12)',
    borderRadius: '6px',
    padding: '0 6px',
    boxShadow: 'inset 3px 0 0 #F04444',
};

const errorLineNumberStyle = {
    color: '#F04444',
    fontWeight: '700',
};

const snippet = reactive({
    loading: false,
    code: '',
    language: 'plaintext',
    startLine: 0,
    endLine: 0,
    fetchedFrom: '',
    error: '',
});

const snippetRows = computed((): CodeRow[] => {
    if (!snippet.code) {
        return [];
    }
    return buildHighlightedRows(snippet.code, snippet.startLine, snippet.language);
});

let snippetRequestId = 0;
watch(
    () => primaryFrame.value?.raw,
    async () => {
        const frame = primaryFrame.value;

        snippet.code = '';
        snippet.startLine = 0;
        snippet.endLine = 0;
        snippet.fetchedFrom = '';
        snippet.error = '';
        snippet.language = 'plaintext';

        if (!frame) {
            return;
        }

        await loadSnippet(frame);
    },
    { immediate: true },
);

function parseStack(stack: string): StackFrame[] {
    if (!stack) {
        return [];
    }
    return stack
        .split(/\r?\n/)
        .map((line) => parseStackLine(line))
        .filter((v): v is StackFrame => Boolean(v));
}

function escapeHtml(input: string): string {
    return input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function splitLines(input: string): string[] {
    return input.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');
}

function buildPlainRows(code: string, startLineNumber: number): CodeRow[] {
    const lines = splitLines(code);
    if (lines.length === 0) {
        return [];
    }
    return lines.map((line, index) => {
        return {
            lineNumber: startLineNumber + index,
            html: escapeHtml(line),
        };
    });
}

function buildHighlightedRows(code: string, startLineNumber: number, language: string): CodeRow[] {
    const lines = splitLines(code);

    const canHighlight = Boolean(language && hljs.getLanguage(language));
    return lines.map((line, index) => {
        if (!canHighlight || !line) {
            return {
                lineNumber: startLineNumber + index,
                html: escapeHtml(line),
            };
        }

        try {
            return {
                lineNumber: startLineNumber + index,
                html: hljs.highlight(line, { language }).value,
            };
        } catch (e) {
            console.error(e);
            return {
                lineNumber: startLineNumber + index,
                html: escapeHtml(line),
            };
        }
    });
}

function parseStackLine(line: string): StackFrame | null {
    const raw = line.trim();
    if (!raw) {
        return null;
    }

    const matchParen = raw.match(/\((.+):(\d+):(\d+)\)/);
    if (matchParen) {
        const url = matchParen[1];
        const lineText = matchParen[2];
        const columnText = matchParen[3];
        if (!url || !lineText || !columnText) {
            return null;
        }
        const lineNumber = Number(lineText);
        const columnNumber = Number(columnText);
        if (!Number.isFinite(lineNumber) || !Number.isFinite(columnNumber)) {
            return null;
        }
        return {
            raw,
            url,
            line: lineNumber,
            column: columnNumber,
            displayPath: toDisplayPath(url),
        };
    }

    const matchAt = raw.match(/\bat\s+(.+):(\d+):(\d+)\b/);
    if (matchAt) {
        const url = matchAt[1];
        const lineText = matchAt[2];
        const columnText = matchAt[3];
        if (!url || !lineText || !columnText) {
            return null;
        }
        const lineNumber = Number(lineText);
        const columnNumber = Number(columnText);
        if (!Number.isFinite(lineNumber) || !Number.isFinite(columnNumber)) {
            return null;
        }
        return {
            raw,
            url,
            line: lineNumber,
            column: columnNumber,
            displayPath: toDisplayPath(url),
        };
    }

    const matchFirefox = raw.match(/@(.+):(\d+):(\d+)\b/);
    if (matchFirefox) {
        const url = matchFirefox[1];
        const lineText = matchFirefox[2];
        const columnText = matchFirefox[3];
        if (!url || !lineText || !columnText) {
            return null;
        }
        const lineNumber = Number(lineText);
        const columnNumber = Number(columnText);
        if (!Number.isFinite(lineNumber) || !Number.isFinite(columnNumber)) {
            return null;
        }
        return {
            raw,
            url,
            line: lineNumber,
            column: columnNumber,
            displayPath: toDisplayPath(url),
        };
    }

    return null;
}

function toDisplayPath(rawUrl: string): string {
    const withoutHash = rawUrl.split('#')[0] ?? rawUrl;
    const clean = withoutHash.split('?')[0] ?? withoutHash;

    try {
        const url = new URL(clean, window.location.origin);

        const pathname = url.pathname;
        const fsIndex = pathname.indexOf('/@fs/');
        if (fsIndex >= 0) {
            const abs = decodeURIComponent(pathname.slice(fsIndex + '/@fs/'.length));
            const srcIndex = abs.lastIndexOf('/src/');
            if (srcIndex >= 0) {
                return abs.slice(srcIndex + 1);
            }
            return abs;
        }

        const srcIndex = pathname.lastIndexOf('/src/');
        if (srcIndex >= 0) {
            return pathname.slice(srcIndex + 1);
        }

        return pathname.startsWith('/') ? pathname.slice(1) : pathname;
    } catch {
        const srcIndex = clean.lastIndexOf('/src/');
        if (srcIndex >= 0) {
            return clean.slice(srcIndex + 1);
        }
        return clean;
    }
}

function guessLanguageFromPath(pathname: string): string {
    const withoutHash = pathname.split('#')[0] ?? pathname;
    const clean = withoutHash.split('?')[0] ?? withoutHash;
    const lower = clean.toLowerCase();

    if (lower.endsWith('.ts') || lower.endsWith('.tsx')) {
        return 'typescript';
    }
    if (lower.endsWith('.js') || lower.endsWith('.jsx') || lower.endsWith('.mjs') || lower.endsWith('.cjs')) {
        return 'javascript';
    }
    if (lower.endsWith('.vue') || lower.endsWith('.html') || lower.endsWith('.xml')) {
        return 'xml';
    }
    if (lower.endsWith('.scss')) {
        return 'scss';
    }
    if (lower.endsWith('.css')) {
        return 'css';
    }
    if (lower.endsWith('.json')) {
        return 'json';
    }

    return 'plaintext';
}

function getSameOriginHttpUrl(rawUrl: string): URL | null {
    const clean = rawUrl.split('#')[0] ?? rawUrl;

    try {
        const url =
            clean.startsWith('http://') || clean.startsWith('https://')
                ? new URL(clean)
                : new URL(clean, window.location.origin);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return null;
        }
        if (url.origin !== window.location.origin) {
            return null;
        }
        return url;
    } catch {
        return null;
    }
}

async function loadSnippet(frame: StackFrame): Promise<void> {
    const requestId = ++snippetRequestId;
    snippet.loading = true;

    try {
        const url = getSameOriginHttpUrl(frame.url);
        if (!url) {
            snippet.error = 'Unsupported URL';
            return;
        }

        const res = await fetch(url.toString(), { credentials: 'same-origin' });
        if (!res.ok) {
            snippet.error = `HTTP ${res.status}`;
            return;
        }

        const text = await res.text();
        const lines = text.split(/\r?\n/);
        if (!Number.isFinite(frame.line) || frame.line <= 0 || frame.line > lines.length) {
            snippet.error = 'Line out of range';
            return;
        }

        const context = 8;
        const start = Math.max(0, frame.line - 1 - context);
        const end = Math.min(lines.length, frame.line - 1 + context + 1);
        const code = lines.slice(start, end).join('\n');

        if (requestId !== snippetRequestId) {
            return;
        }

        snippet.code = code;
        snippet.startLine = start + 1;
        snippet.endLine = end;
        snippet.fetchedFrom = toDisplayPath(url.toString());
        snippet.language = guessLanguageFromPath(url.pathname);
    } catch (e) {
        console.error(e);
        snippet.error = String(e);
    } finally {
        if (requestId === snippetRequestId) {
            snippet.loading = false;
        }
    }
}
</script>

<template>
    <n-config-provider :hljs="hljs" :theme="darkTheme" class="font-sans">
        <div id="content" class="min-h-screen bg-black text-white p-4">
            <div class="mx-auto w-full max-w-6xl">
                <n-card size="small">
                    <n-flex vertical size="large" class="min-w-0">
                        <n-flex align="center" justify="space-between" wrap>
                            <div class="min-w-0">
                                <div class="text-3xl fw-bold leading-tight">
                                    {{ $t('error.title') }}
                                </div>
                                <div class="mt-1 text-xs opacity-70 break-all">
                                    {{ $t('error.route') }}: {{ route.fullPath }}
                                </div>
                            </div>
                        </n-flex>

                        <template v-if="props.error">
                            <n-alert :show-icon="false" type="error">
                                <template #header>
                                    <span class="fw-bold">{{ props.error.name ?? 'Error' }}</span>
                                    <template v-if="props.error.statusCode">
                                        <span class="ml-2 opacity-70">
                                            {{ props.error.statusCode }}
                                            <template v-if="props.error.statusMessage">{{
                                                ' ' + props.error.statusMessage
                                            }}</template>
                                        </span>
                                    </template>
                                </template>
                                <div class="break-words">{{ props.error.message }}</div>
                            </n-alert>
                        </template>
                        <template v-else>
                            <n-alert :show-icon="false" type="error">?</n-alert>
                        </template>

                        <n-divider />

                        <n-flex vertical size="small">
                            <div class="text-sm fw-bold">{{ $t('error.page_source') }}</div>
                            <n-code :code="errorPageSource" language="plaintext" />
                        </n-flex>

                        <template v-if="primaryLocationText">
                            <n-flex vertical size="small">
                                <div class="text-sm fw-bold">{{ $t('error.location') }}</div>
                                <n-code :code="primaryLocationText" language="plaintext" />
                            </n-flex>
                        </template>

                        <template v-if="stackText">
                            <n-flex vertical size="small" class="min-w-0">
                                <div class="text-sm fw-bold">{{ $t('error.stack') }}</div>
                                <n-code class="block w-full">
                                    <div class="flex flex-col gap-1">
                                        <div v-for="row in stackRows" :key="row.lineNumber" class="flex gap-3">
                                            <div
                                                class="shrink-0 select-none text-right text-xs leading-5"
                                                style="width: 3.5em; color: var(--n-line-number-text-color)"
                                            >
                                                {{ row.lineNumber }}
                                            </div>
                                            <div
                                                class="min-w-0 flex-1 text-xs leading-5 whitespace-pre-wrap break-all"
                                                v-html="row.html"
                                            />
                                        </div>
                                    </div>
                                </n-code>
                            </n-flex>
                        </template>
                        <template v-else>
                            <div class="text-xs opacity-70">{{ $t('error.no_stack') }}</div>
                        </template>

                        <template v-if="primaryFrame">
                            <n-flex vertical size="small">
                                <div class="text-sm fw-bold">{{ $t('error.snippet') }}</div>

                                <template v-if="snippet.loading">
                                    <div class="text-xs opacity-70">{{ $t('error.snippet_loading') }}</div>
                                </template>

                                <template v-else-if="snippet.code">
                                    <div class="text-xs opacity-70 break-all">
                                        {{ snippet.fetchedFrom }} ({{ snippet.startLine }}-{{ snippet.endLine }})
                                    </div>
                                    <n-code class="block w-full">
                                        <div class="flex flex-col gap-1">
                                            <div
                                                v-for="row in snippetRows"
                                                :key="row.lineNumber"
                                                class="flex gap-3"
                                                :style="row.lineNumber === snippetErrorLine ? errorRowStyle : undefined"
                                            >
                                                <div
                                                    class="shrink-0 select-none text-xs leading-5 flex items-center justify-end gap-2"
                                                    style="width: 3.5em; color: var(--n-line-number-text-color)"
                                                    :style="
                                                        row.lineNumber === snippetErrorLine
                                                            ? errorLineNumberStyle
                                                            : undefined
                                                    "
                                                >
                                                    <span
                                                        v-if="row.lineNumber === snippetErrorLine"
                                                        style="color: #f04444"
                                                    >
                                                        ●
                                                    </span>
                                                    <span>{{ row.lineNumber }}</span>
                                                </div>
                                                <div
                                                    class="min-w-0 flex-1 text-xs leading-5 whitespace-pre-wrap break-all"
                                                    v-html="row.html"
                                                />
                                            </div>
                                        </div>
                                    </n-code>
                                    <div class="text-xs opacity-70">
                                        {{ $t('error.location') }}: {{ primaryLocationText }}
                                    </div>
                                </template>

                                <template v-else>
                                    <div class="text-xs opacity-70">
                                        {{ $t('error.snippet_failed') }}
                                        <template v-if="snippet.error">: {{ snippet.error }}</template>
                                    </div>
                                </template>
                            </n-flex>
                        </template>
                    </n-flex>
                </n-card>
            </div>
        </div>
    </n-config-provider>
</template>
