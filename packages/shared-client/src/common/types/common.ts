export enum LoadingState {
    IDLE = 'IDLE',
    REQUEST = 'REQUEST',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export interface Runnable<T> {
    run: (fn: (() => Promise<T>) | (() => T)) => Promise<T | undefined> | T | undefined;
}

export interface ErrorInner {
    code?: string;
    message: string;
}

export interface ITreeNode<T> {
    id: string;
    item: T;
    displayName: string;
    parents: ITreeNode<T>[];
    children: ITreeNode<T>[];
    deep: number;
    path: string;
    flatten: ITreeNode<T>[];
    add(item: ITreeNode<T>): void;
    remove(id: string): void;
}

export type Path<T, Depth extends number = 4> = [Depth] extends [never]
    ? never
    : T extends object
      ? {
            [K in keyof T & string]: K | `${K}.${Path<T[K], PrevDepth<Depth>>}`;
        }[keyof T & string]
      : never;

type PrevDepth<T extends number> = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][T];

export interface ISearchParams<T> {
    /**
     *  Example: "data", "data.name"
     */
    fields?: Path<T>[];
    searchBy?: string;
    minSearchLength?: number;
    debounce?: number;
}

export interface Search<T> {
    searchBy: string;
    searchFields: string[];
    setSearchFields: (fields: string[]) => void;
    setSearchBy: (searchBy: string, shouldRun?: boolean) => void;
    items: T[];
}

export enum OrderBy {
    Asc = 'Asc',
    Desc = 'Desc',
}
