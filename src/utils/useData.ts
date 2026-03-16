import { z } from 'zod';

type ErrorConstructorWithCaptureStackTrace = ErrorConstructor & {
    captureStackTrace?: (targetObject: object, constructorOpt?: Function) => void;
};

const ErrorWithCaptureStackTrace = Error as ErrorConstructorWithCaptureStackTrace;

function attachModelLocationStack(error: Error, location: Error): void {
    if (!location.stack) {
        return;
    }

    error.stack = [location.stack, '', 'Caused by:', error.stack].filter((v): v is string => Boolean(v)).join('\n');
}

const MAX_IMAGE_DATA_URI_LENGTH = 160;
const IMAGE_DATA_URI_HEAD_CHARS = 32;
const IMAGE_DATA_URI_TAIL_CHARS = 16;

function isImageDataUri(value: string): boolean {
    return value.slice(0, 11).toLowerCase() === 'data:image/';
}

function truncateImageDataUri(value: string): string {
    if (!isImageDataUri(value) || value.length <= MAX_IMAGE_DATA_URI_LENGTH) {
        return value;
    }

    const commaIndex = value.indexOf(',');
    if (commaIndex < 0) {
        return `${value.slice(0, MAX_IMAGE_DATA_URI_LENGTH)}… (len=${value.length})`;
    }

    const header = value.slice(0, commaIndex + 1);
    const payload = value.slice(commaIndex + 1);
    if (payload.length <= IMAGE_DATA_URI_HEAD_CHARS + IMAGE_DATA_URI_TAIL_CHARS + 1) {
        return value;
    }

    const head = payload.slice(0, IMAGE_DATA_URI_HEAD_CHARS);
    const tail = payload.slice(-IMAGE_DATA_URI_TAIL_CHARS);
    return `${header}${head}…${tail} (len=${payload.length})`;
}

function sanitizeDebugInput(value: unknown, depth = 0): unknown {
    if (typeof value === 'string') {
        return truncateImageDataUri(value);
    }

    if (depth >= 20) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((v) => sanitizeDebugInput(v, depth + 1));
    }

    if (typeof value === 'object' && value !== null) {
        const obj = value as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        for (const [key, v] of Object.entries(obj)) {
            out[key] = sanitizeDebugInput(v, depth + 1);
        }
        return out;
    }

    return value;
}

function sanitizeIssuePath(path: readonly PropertyKey[]): Array<string | number> {
    return path.map((segment) => (typeof segment === 'symbol' ? String(segment) : segment));
}

export type ZodDebugIssue = Readonly<{
    path: Array<string | number>;
    message: string;
    code?: string;
    expected?: unknown;
    received?: unknown;
    keys?: unknown;
    options?: unknown;
}>;

export type ZodDebugData = Readonly<{
    type: 'zod';
    input: unknown;
    issues: ZodDebugIssue[];
    focusPath: Array<string | number>;
}>;

export type ErrorWithZodDebugData = Error & {
    data?: unknown;
};

function attachZodDebugData(error: Error, input: unknown, issues: z.ZodIssue[]): void {
    const focusPath = sanitizeIssuePath(issues[0]?.path ?? []);
    const sanitizedInput = sanitizeDebugInput(input);
    const mappedIssues: ZodDebugIssue[] = issues.map((iss) => {
        return {
            path: sanitizeIssuePath(iss.path),
            message: iss.message,
            code: iss.code,
            expected: 'expected' in iss ? (iss as { expected?: unknown }).expected : undefined,
            received: 'received' in iss ? (iss as { received?: unknown }).received : undefined,
            keys: 'keys' in iss ? (iss as { keys?: unknown }).keys : undefined,
            options: 'options' in iss ? (iss as { options?: unknown }).options : undefined,
        };
    });

    const data: ZodDebugData = {
        type: 'zod',
        input: sanitizedInput,
        issues: mappedIssues,
        focusPath,
    };

    (error as ErrorWithZodDebugData).data = data;
}

export default function useData<T extends z.ZodTypeAny>(model: T): z.output<T> {
    const modelLocation = new Error('[useData] Data model defined here');
    ErrorWithCaptureStackTrace.captureStackTrace?.(modelLocation, useData);

    let raw: unknown;
    try {
        raw = JSON.parse(window.__DATA__);
    } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        attachModelLocationStack(error, modelLocation);
        throw error;
    }

    const result = model.safeParse(raw);
    if (result.success) {
        return result.data;
    }

    const error = result.error;
    attachZodDebugData(error, raw, error.issues);
    attachModelLocationStack(error, modelLocation);
    throw error;
}
