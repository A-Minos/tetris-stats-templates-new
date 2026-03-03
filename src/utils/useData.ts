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
    attachModelLocationStack(error, modelLocation);
    throw error;
}
