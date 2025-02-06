import { useRef } from 'react';

export type Named<T> = { [P in keyof T]: any };

export function useVar<T extends Named<T> | Named<any>>(value: Named<T>) {
    const variable = useRef<Named<T>>(value).current;

    return variable as T | Named<T>;
}
