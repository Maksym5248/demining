export const isObject = (value: unknown): value is object =>
    value !== null && typeof value === 'object' && !Array.isArray(value);
export const isUndefined = <T = unknown>(value: T | undefined): value is undefined =>
    typeof value === 'undefined';
export const isString = <T = unknown>(value: T | string): value is string =>
    typeof value === 'string';
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function => typeof value === 'function';
export const isArray = <T>(value: unknown): value is T[] => Array.isArray(value);
