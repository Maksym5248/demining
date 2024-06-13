function getItemByPathArray<T>(value: T, path: string[]): unknown {
    const [current, ...rest] = path;
    const currentValue = value[current as keyof T];

    if (!currentValue) {
        return undefined;
    }

    if (!rest.length) {
        return value[current as keyof T];
    }

    return getItemByPathArray(value[current as keyof T], rest);
}

/**
 *  Example: "data", "data.name"
 */
export function path<T>(value: T, path: string): unknown {
    return getItemByPathArray<T>(value, path.split('.'));
}

export function cloneDeep<T>(value: T) {
    return JSON.parse(JSON.stringify(value)) as T;
}
