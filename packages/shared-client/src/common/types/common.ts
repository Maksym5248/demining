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

export interface TreeNode<T> {
    id: string;
    item: T;
    children: TreeNode<T>[];
}
