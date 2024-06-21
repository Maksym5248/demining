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

function removeField<T>(obj: T, field: string): T {
    if (obj[field as keyof T]) {
        delete obj[field as keyof T];
    }

    return obj;
}

export function removeFields<T>(obj: T, fields: string | string[]): T {
    if (Array.isArray(fields)) {
        fields.forEach((f) => removeField(obj, f));
    } else {
        removeField(obj, fields);
    }

    return obj;
}
