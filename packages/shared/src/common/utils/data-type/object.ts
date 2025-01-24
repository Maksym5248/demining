type Path<T, Depth extends number = 4> = [Depth] extends [never]
    ? never
    : T extends object
      ? {
            [K in keyof T & string]: K | `${K}.${Path<T[K], PrevDepth<Depth>>}`;
        }[keyof T & string]
      : never;

type PrevDepth<T extends number> = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][T];

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
export function path<T>(value: T, p: Path<T> | undefined): unknown {
    return p ? getItemByPathArray<T>(value, p.split('.')) : undefined;
}

export function cloneDeep<T>(value: T) {
    return JSON.parse(JSON.stringify(value)) as T;
}

function removeField<T>(obj: T, field: string) {
    delete obj[field as keyof T];
}

export function removeFields<T>(obj: T, fields: string | string[]): T {
    if (Array.isArray(fields)) {
        fields.forEach(f => removeField(obj, f));
    } else {
        removeField(obj, fields);
    }

    return obj;
}
