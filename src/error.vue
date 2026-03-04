<script setup lang="ts">
import type { NuxtError } from '#app';
import type { SectionedSourceMapInput } from '@jridgewell/trace-mapping';
import hljs from 'highlight.js/lib/common';
import { darkTheme } from 'naive-ui';
import type { ZodDebugData } from '~/utils/useData';

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

type SnippetState = {
    loading: boolean;
    code: string;
    language: string;
    startLine: number;
    endLine: number;
    fetchedFrom: string;
    errorLine: number | null;
    errorColumn: number | null;
    locationText: string;
    error: string;
};

type PathSegment = string | number;
type Path = PathSegment[];

type ZodIssueRow = Readonly<{
    key: string;
    pathText: string;
    message: string;
    isFocus: boolean;
}>;

type JsonRenderRow = Readonly<{
    lineNumber: number;
    html: string;
    path: Path | null;
}>;

type JsonExcerptRow = Readonly<{
    lineNumber: number;
    html: string;
    isFocus: boolean;
}>;

type JsonExcerpt = Readonly<{
    rows: JsonExcerptRow[];
    startLine: number;
    endLine: number;
    totalLines: number;
    truncated: boolean;
    highlightPath: Path | null;
}>;

const props = defineProps<{
    error?: NuxtError;
}>();

useLang();

const route = useRoute();

const zodDebug = computed((): ZodDebugData | null => {
    const direct = props.error?.data;
    if (isZodDebugData(direct)) {
        return direct;
    }

    const cause = props.error?.cause;
    if (isRecord(cause) && 'data' in cause) {
        const causeData = (cause as { data?: unknown }).data;
        if (isZodDebugData(causeData)) {
            return causeData;
        }
    }

    return null;
});

const zodIssueRows = computed((): ZodIssueRow[] => {
    const debug = zodDebug.value;
    if (!debug) {
        return [];
    }

    const focusKey = serializePath(debug.focusPath);

    return debug.issues.slice(0, 6).map((issue, index) => {
        const key = `${serializePath(issue.path)}-${index}`;
        return {
            key,
            pathText: formatPath(issue.path),
            message: issue.message,
            isFocus: serializePath(issue.path) === focusKey,
        };
    });
});

const zodFocusText = computed(() => {
    const debug = zodDebug.value;
    if (!debug) {
        return '';
    }
    return formatPath(debug.focusPath);
});

const zodInputExcerpt = computed((): JsonExcerpt => {
    const debug = zodDebug.value;
    if (!debug) {
        return {
            rows: [],
            startLine: 0,
            endLine: 0,
            totalLines: 0,
            truncated: false,
            highlightPath: null,
        };
    }

    return buildJsonExcerpt(debug.input, debug.focusPath);
});

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

const snippet = reactive<SnippetState>({
    loading: false,
    code: '',
    language: 'plaintext',
    startLine: 0,
    endLine: 0,
    fetchedFrom: '',
    errorLine: null,
    errorColumn: null,
    locationText: '',
    error: '',
});

const bestLocationText = computed(() => {
    return snippet.locationText || primaryLocationText.value;
});

const snippetRows = computed((): CodeRow[] => {
    if (!snippet.code) {
        return [];
    }
    return buildHighlightedRows(snippet.code, snippet.startLine, snippet.language);
});

let snippetRequestId = 0;
let snippetAbortController: AbortController | null = null;

function resetSnippetState(): void {
    snippet.code = '';
    snippet.startLine = 0;
    snippet.endLine = 0;
    snippet.fetchedFrom = '';
    snippet.errorLine = null;
    snippet.errorColumn = null;
    snippet.locationText = '';
    snippet.error = '';
    snippet.language = 'plaintext';
}

function cancelSnippetLoad(): void {
    if (!snippetAbortController) {
        return;
    }
    snippetAbortController.abort();
    snippetAbortController = null;
}

onBeforeUnmount(() => {
    cancelSnippetLoad();
});

watch(
    () => primaryFrame.value?.raw,
    async () => {
        const frame = primaryFrame.value;

        cancelSnippetLoad();
        resetSnippetState();

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

function formatPath(path: Path): string {
    if (path.length === 0) {
        return '$';
    }

    let text = '$';
    for (const seg of path) {
        if (typeof seg === 'number') {
            text += `[${seg}]`;
            continue;
        }

        if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(seg)) {
            text += `.${seg}`;
            continue;
        }

        text += `[${JSON.stringify(seg)}]`;
    }
    return text;
}

function serializePath(path: Path): string {
    return path.map((seg) => (typeof seg === 'number' ? `[${seg}]` : `.${seg}`)).join('');
}

function isPathEqual(a: Path, b: Path): boolean {
    if (a.length !== b.length) {
        return false;
    }
    return a.every((seg, i) => seg === b[i]);
}

function isPathArray(value: unknown): value is Path {
    return Array.isArray(value) && value.every((v) => typeof v === 'string' || typeof v === 'number');
}

function isZodDebugData(value: unknown): value is ZodDebugData {
    if (!isRecord(value)) {
        return false;
    }
    if (value.type !== 'zod') {
        return false;
    }

    const issues = value.issues;
    const focusPath = value.focusPath;
    if (!Array.isArray(issues) || !isPathArray(focusPath)) {
        return false;
    }

    return issues.every((iss) => {
        return (
            isRecord(iss) &&
            typeof iss.message === 'string' &&
            isPathArray(iss.path) &&
            (iss.code === undefined || typeof iss.code === 'string')
        );
    });
}

function isJsonPrimitive(value: unknown): value is string | number | boolean | null {
    return value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function jsonStringifyPrimitive(value: string | number | boolean | null): string {
    if (value === null) {
        return 'null';
    }
    if (typeof value === 'string') {
        return JSON.stringify(value);
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? String(value) : 'null';
    }
    return value ? 'true' : 'false';
}

function highlightJsonLine(line: string): string {
    const canHighlight = Boolean(hljs.getLanguage('json'));
    if (!canHighlight || !line) {
        return escapeHtml(line);
    }

    try {
        return hljs.highlight(line, { language: 'json' }).value;
    } catch (e) {
        console.error(e);
        return escapeHtml(line);
    }
}

function buildJsonRows(value: unknown, maxLines: number): { rows: JsonRenderRow[]; truncated: boolean } {
    const rows: JsonRenderRow[] = [];
    let lineNumber = 1;
    let truncated = false;

    const indentUnit = '  ';
    const indent = (level: number) => indentUnit.repeat(level);

    const pushLine = (text: string, path: Path | null) => {
        if (rows.length >= maxLines) {
            truncated = true;
            return;
        }
        rows.push({
            lineNumber,
            html: highlightJsonLine(text),
            path,
        });
        lineNumber += 1;
    };

    const isPlainObject = (input: unknown): input is Record<string, unknown> => {
        if (!isRecord(input)) {
            return false;
        }
        return Object.prototype.toString.call(input) === '[object Object]';
    };

    const renderValue = (input: unknown, path: Path, level: number, withComma: boolean) => {
        if (rows.length >= maxLines) {
            truncated = true;
            return;
        }

        if (isJsonPrimitive(input)) {
            pushLine(`${indent(level)}${jsonStringifyPrimitive(input)}${withComma ? ',' : ''}`, path);
            return;
        }

        if (Array.isArray(input)) {
            if (input.length === 0) {
                pushLine(`${indent(level)}[]${withComma ? ',' : ''}`, path);
                return;
            }
            pushLine(`${indent(level)}[`, path);
            input.forEach((el, index) => {
                renderValue(el, [...path, index], level + 1, index !== input.length - 1);
            });
            pushLine(`${indent(level)}]${withComma ? ',' : ''}`, null);
            return;
        }

        if (isPlainObject(input)) {
            const keys = Object.keys(input);
            if (keys.length === 0) {
                pushLine(`${indent(level)}{}${withComma ? ',' : ''}`, path);
                return;
            }
            pushLine(`${indent(level)}{`, path);
            keys.forEach((key, index) => {
                renderProperty(key, input[key], [...path, key], level + 1, index !== keys.length - 1);
            });
            pushLine(`${indent(level)}}${withComma ? ',' : ''}`, null);
            return;
        }

        pushLine(`${indent(level)}${JSON.stringify(String(input))}${withComma ? ',' : ''}`, path);
    };

    const renderProperty = (key: string, input: unknown, path: Path, level: number, withComma: boolean) => {
        const keyJson = JSON.stringify(key);
        const prefix = `${indent(level)}${keyJson}: `;

        if (isJsonPrimitive(input)) {
            pushLine(`${prefix}${jsonStringifyPrimitive(input)}${withComma ? ',' : ''}`, path);
            return;
        }

        if (Array.isArray(input)) {
            if (input.length === 0) {
                pushLine(`${prefix}[]${withComma ? ',' : ''}`, path);
                return;
            }
            pushLine(`${prefix}[`, path);
            input.forEach((el, index) => {
                renderValue(el, [...path, index], level + 1, index !== input.length - 1);
            });
            pushLine(`${indent(level)}]${withComma ? ',' : ''}`, null);
            return;
        }

        if (isPlainObject(input)) {
            const keys = Object.keys(input);
            if (keys.length === 0) {
                pushLine(`${prefix}{}${withComma ? ',' : ''}`, path);
                return;
            }
            pushLine(`${prefix}{`, path);
            keys.forEach((childKey, index) => {
                renderProperty(childKey, input[childKey], [...path, childKey], level + 1, index !== keys.length - 1);
            });
            pushLine(`${indent(level)}}${withComma ? ',' : ''}`, null);
            return;
        }

        pushLine(`${prefix}${JSON.stringify(String(input))}${withComma ? ',' : ''}`, path);
    };

    renderValue(value, [], 0, false);
    return { rows, truncated };
}

function buildJsonExcerpt(input: unknown, focusPath: Path): JsonExcerpt {
    const { rows, truncated } = buildJsonRows(input, 5000);

    const highlightPath = findNearestExistingPath(rows, focusPath);
    const focusIndex = highlightPath
        ? rows.findIndex((r) => r.path && isPathEqual(r.path, highlightPath))
        : rows.findIndex((r) => r.path && isPathEqual(r.path, []));

    const index = focusIndex >= 0 ? focusIndex : 0;
    const context = 10;
    const start = Math.max(0, index - context);
    const end = Math.min(rows.length, index + context + 1);
    const excerptRows = rows.slice(start, end).map((r) => {
        return {
            lineNumber: r.lineNumber,
            html: r.html,
            isFocus: Boolean(highlightPath && r.path && isPathEqual(r.path, highlightPath)),
        };
    });

    return {
        rows: excerptRows,
        startLine: excerptRows[0]?.lineNumber ?? 0,
        endLine: excerptRows.at(-1)?.lineNumber ?? 0,
        totalLines: rows.length,
        truncated,
        highlightPath,
    };
}

function findNearestExistingPath(rows: JsonRenderRow[], target: Path): Path | null {
    for (let len = target.length; len >= 0; len -= 1) {
        const prefix = target.slice(0, len);
        if (rows.some((r) => r.path && isPathEqual(r.path, prefix))) {
            return prefix;
        }
    }
    return null;
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

function buildStackFrame(raw: string, match: RegExpMatchArray | null): StackFrame | null {
    if (!match) {
        return null;
    }

    const url = match[1];
    const lineText = match[2];
    const columnText = match[3];
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

function parseStackLine(line: string): StackFrame | null {
    const raw = line.trim();
    if (!raw) {
        return null;
    }

    const frameFromParen = buildStackFrame(raw, raw.match(/\((.+):(\d+):(\d+)\)/));
    if (frameFromParen) {
        return frameFromParen;
    }

    const frameFromAt = buildStackFrame(raw, raw.match(/\bat\s+(.+):(\d+):(\d+)\b/));
    if (frameFromAt) {
        return frameFromAt;
    }

    const frameFromFirefox = buildStackFrame(raw, raw.match(/@(.+):(\d+):(\d+)\b/));
    if (frameFromFirefox) {
        return frameFromFirefox;
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

type SnippetResult = Readonly<{
    code: string;
    language: string;
    startLine: number;
    endLine: number;
    fetchedFrom: string;
    errorLine: number;
    errorColumn: number;
    locationText: string;
}>;

type SourceMapFetchResult = Readonly<{
    map: SectionedSourceMapInput;
    mapUrl: string | null;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isAbortError(value: unknown): boolean {
    if (value instanceof DOMException) {
        return value.name === 'AbortError';
    }
    if (!isRecord(value)) {
        return false;
    }
    return value.name === 'AbortError';
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function isStringOrNullArray(value: unknown): value is Array<string | null> {
    return Array.isArray(value) && value.every((v) => typeof v === 'string' || v === null);
}

function isSourceMapInput(value: unknown): value is SectionedSourceMapInput {
    if (!isRecord(value)) {
        return false;
    }
    if (value.version !== 3) {
        return false;
    }

    if (Array.isArray(value.sections)) {
        return true;
    }

    return typeof value.mappings === 'string' && isStringOrNullArray(value.sources) && isStringArray(value.names);
}

function buildSnippetFromSourceText(
    sourceText: string,
    displayPath: string,
    language: string,
    errorLine: number,
    errorColumn: number,
): SnippetResult | null {
    const lines = splitLines(sourceText);
    if (!Number.isFinite(errorLine) || errorLine <= 0 || errorLine > lines.length) {
        return null;
    }

    const context = 8;
    const start = Math.max(0, errorLine - 1 - context);
    const end = Math.min(lines.length, errorLine - 1 + context + 1);
    const code = lines.slice(start, end).join('\n');

    return {
        code,
        language,
        startLine: start + 1,
        endLine: end,
        fetchedFrom: displayPath,
        errorLine,
        errorColumn,
        locationText: `${displayPath}:${errorLine}:${errorColumn}`,
    };
}

function buildSnippetFromBundleText(bundleText: string, bundleUrl: URL, frame: StackFrame): SnippetResult | null {
    const displayPath = toDisplayPath(bundleUrl.toString());
    const language = guessLanguageFromPath(bundleUrl.pathname);
    const errorLine = frame.line;
    const errorColumn = frame.column;

    return buildSnippetFromSourceText(bundleText, displayPath, language, errorLine, errorColumn);
}

function extractSourceMappingURL(codeText: string): string | null {
    const marker = 'sourceMappingURL=';
    const index = codeText.lastIndexOf(marker);
    if (index < 0) {
        return null;
    }
    const after = codeText.slice(index + marker.length);
    const firstLine = after.split(/\r?\n/)[0];
    const url = firstLine?.trim();
    if (!url) {
        return null;
    }
    return url;
}

function decodeBase64Utf8(base64: string): string {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function parseInlineSourceMap(dataUrl: string): SectionedSourceMapInput | null {
    const match = dataUrl.match(/^data:application\/json(?:;charset=[^;]+)?;base64,(.+)$/);
    if (!match) {
        return null;
    }
    const base64 = match[1];
    if (!base64) {
        return null;
    }
    try {
        const jsonText = decodeBase64Utf8(base64);
        const parsed = JSON.parse(jsonText) as unknown;
        return isSourceMapInput(parsed) ? parsed : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function tryFetchSourceMap(
    codeUrl: URL,
    codeText: string,
    signal?: AbortSignal,
): Promise<SourceMapFetchResult | null> {
    const mappingUrl = extractSourceMappingURL(codeText);
    if (mappingUrl) {
        if (mappingUrl.startsWith('data:')) {
            const map = parseInlineSourceMap(mappingUrl);
            if (map) {
                return { map, mapUrl: null };
            }
        } else {
            try {
                const mapUrl = new URL(mappingUrl, codeUrl.toString());
                const res = await fetch(mapUrl.toString(), { credentials: 'same-origin', signal });
                if (res.ok) {
                    const map = (await res.json()) as unknown;
                    if (isSourceMapInput(map)) {
                        return { map, mapUrl: mapUrl.toString() };
                    }
                }
            } catch (e) {
                if (isAbortError(e)) {
                    throw e;
                }
                console.error(e);
            }
        }
    }

    try {
        const mapUrl = new URL(codeUrl.toString());
        mapUrl.pathname = `${mapUrl.pathname}.map`;
        const res = await fetch(mapUrl.toString(), { credentials: 'same-origin', signal });
        if (!res.ok) {
            return null;
        }
        const map = (await res.json()) as unknown;
        if (!isSourceMapInput(map)) {
            return null;
        }
        return { map, mapUrl: mapUrl.toString() };
    } catch (e) {
        if (isAbortError(e)) {
            throw e;
        }
        console.error(e);
        return null;
    }
}

async function tryBuildSnippetFromSourceMap(
    codeUrl: URL,
    codeText: string,
    frame: StackFrame,
    signal?: AbortSignal,
): Promise<SnippetResult | null> {
    const mapResult = await tryFetchSourceMap(codeUrl, codeText, signal);
    if (!mapResult) {
        return null;
    }

    const genLine = frame.line;
    const genColumn = Math.max(0, Math.floor(frame.column) - 1);
    if (!Number.isFinite(genLine) || !Number.isFinite(genColumn) || genLine <= 0 || genColumn < 0) {
        return null;
    }

    const traceMapping = await import('@jridgewell/trace-mapping');
    const tracer = new traceMapping.AnyMap(mapResult.map, mapResult.mapUrl);

    const attempts = [
        traceMapping.originalPositionFor(tracer, {
            line: genLine,
            column: genColumn,
            bias: traceMapping.GREATEST_LOWER_BOUND,
        }),
        traceMapping.originalPositionFor(tracer, {
            line: genLine,
            column: genColumn,
            bias: traceMapping.LEAST_UPPER_BOUND,
        }),
        traceMapping.originalPositionFor(tracer, {
            line: genLine,
            column: genColumn,
        }),
    ];

    const mapped = attempts.find((m) => m.source !== null && m.line !== null && m.column !== null);
    if (!mapped || mapped.source === null || mapped.line === null || mapped.column === null) {
        return null;
    }

    const sourceText = traceMapping.sourceContentFor(tracer, mapped.source);
    if (!sourceText) {
        return null;
    }

    const displayPath = toDisplayPath(mapped.source);
    const language = guessLanguageFromPath(mapped.source);
    const errorLine = mapped.line;
    const errorColumn = mapped.column + 1;

    return buildSnippetFromSourceText(sourceText, displayPath, language, errorLine, errorColumn);
}

async function loadSnippet(frame: StackFrame): Promise<void> {
    const requestId = ++snippetRequestId;
    cancelSnippetLoad();

    const controller = new AbortController();
    snippetAbortController = controller;
    snippet.loading = true;

    try {
        const url = getSameOriginHttpUrl(frame.url);
        if (!url) {
            snippet.error = 'Unsupported URL';
            return;
        }

        const res = await fetch(url.toString(), { credentials: 'same-origin', signal: controller.signal });
        if (!res.ok) {
            snippet.error = `HTTP ${res.status}`;
            return;
        }

        const text = await res.text();

        const mappedSnippet = await tryBuildSnippetFromSourceMap(url, text, frame, controller.signal);
        const bundleSnippet = mappedSnippet ? null : buildSnippetFromBundleText(text, url, frame);
        const result = mappedSnippet ?? bundleSnippet;

        if (!result) {
            snippet.error = 'Line out of range';
            return;
        }

        if (requestId !== snippetRequestId) {
            return;
        }

        snippet.code = result.code;
        snippet.startLine = result.startLine;
        snippet.endLine = result.endLine;
        snippet.fetchedFrom = result.fetchedFrom;
        snippet.language = result.language;
        snippet.errorLine = result.errorLine;
        snippet.errorColumn = result.errorColumn;
        snippet.locationText = result.locationText;
    } catch (e) {
        if (isAbortError(e)) {
            return;
        }
        console.error(e);
        snippet.error = String(e);
    } finally {
        if (requestId === snippetRequestId) {
            snippet.loading = false;
        }
        if (snippetAbortController === controller) {
            snippetAbortController = null;
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

                        <template v-if="zodDebug">
                            <n-flex vertical size="small" class="min-w-0">
                                <div class="text-sm fw-bold">{{ $t('error.validation_title') }}</div>

                                <div class="text-xs opacity-70 break-all">
                                    {{ $t('error.validation_focus') }}: {{ zodFocusText }}
                                </div>

                                <template v-if="zodIssueRows.length">
                                    <n-code class="block w-full">
                                        <div class="flex flex-col gap-1">
                                            <div v-for="issue in zodIssueRows" :key="issue.key" class="flex gap-3">
                                                <div
                                                    class="shrink-0 select-none text-right text-xs leading-5"
                                                    style="width: 1.5em; color: var(--n-line-number-text-color)"
                                                    :style="issue.isFocus ? errorLineNumberStyle : undefined"
                                                >
                                                    {{ issue.isFocus ? '●' : '' }}
                                                </div>
                                                <div
                                                    class="min-w-0 flex-1 text-xs leading-5 whitespace-pre-wrap break-all"
                                                >
                                                    <span class="opacity-70">{{ issue.pathText }}</span>
                                                    <span>{{ ': ' + issue.message }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </n-code>
                                </template>

                                <n-flex vertical size="small" class="min-w-0">
                                    <div class="text-sm fw-bold">{{ $t('error.validation_input') }}</div>
                                    <template v-if="zodInputExcerpt.rows.length">
                                        <div class="text-xs opacity-70 break-all">
                                            {{ zodInputExcerpt.startLine }}-{{ zodInputExcerpt.endLine }}
                                            <template v-if="zodInputExcerpt.totalLines">
                                                / {{ zodInputExcerpt.totalLines }}
                                            </template>
                                            <template v-if="zodInputExcerpt.truncated">
                                                {{ ' ' + $t('error.validation_truncated') }}
                                            </template>
                                        </div>
                                        <n-code class="block w-full">
                                            <div class="flex flex-col gap-1">
                                                <div
                                                    v-for="row in zodInputExcerpt.rows"
                                                    :key="row.lineNumber"
                                                    class="flex gap-3"
                                                    :style="row.isFocus ? errorRowStyle : undefined"
                                                >
                                                    <div
                                                        class="shrink-0 select-none text-xs leading-5 flex items-center justify-end gap-2"
                                                        style="width: 3.5em; color: var(--n-line-number-text-color)"
                                                        :style="row.isFocus ? errorLineNumberStyle : undefined"
                                                    >
                                                        <span v-if="row.isFocus" style="color: #f04444">●</span>
                                                        <span>{{ row.lineNumber }}</span>
                                                    </div>
                                                    <div
                                                        class="min-w-0 flex-1 text-xs leading-5 whitespace-pre-wrap break-all"
                                                        v-html="row.html"
                                                    />
                                                </div>
                                            </div>
                                        </n-code>
                                    </template>
                                    <template v-else>
                                        <div class="text-xs opacity-70">{{ $t('error.validation_no_input') }}</div>
                                    </template>
                                </n-flex>
                            </n-flex>
                        </template>

                        <n-divider />

                        <template v-if="bestLocationText">
                            <n-flex vertical size="small">
                                <div class="text-sm fw-bold">{{ $t('error.location') }}</div>
                                <n-code :code="bestLocationText" language="plaintext" />
                            </n-flex>
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
                                                :style="
                                                    row.lineNumber === snippet.errorLine ? errorRowStyle : undefined
                                                "
                                            >
                                                <div
                                                    class="shrink-0 select-none text-xs leading-5 flex items-center justify-end gap-2"
                                                    style="width: 3.5em; color: var(--n-line-number-text-color)"
                                                    :style="
                                                        row.lineNumber === snippet.errorLine
                                                            ? errorLineNumberStyle
                                                            : undefined
                                                    "
                                                >
                                                    <span
                                                        v-if="row.lineNumber === snippet.errorLine"
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
                                </template>

                                <template v-else>
                                    <div class="text-xs opacity-70">
                                        {{ $t('error.snippet_failed') }}
                                        <template v-if="snippet.error">: {{ snippet.error }}</template>
                                    </div>
                                </template>
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
                    </n-flex>
                </n-card>
            </div>
        </div>
    </n-config-provider>
</template>
