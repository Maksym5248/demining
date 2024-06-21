import { makeAutoObservable } from 'mobx';

import { type ErrorInner, LoadingState, type Runnable } from '~/common';

export interface IRequestStateModel<T = void> extends Runnable<T> {
    error: ErrorInner | null;
    isLoading: boolean;
    isLoaded: boolean;
    isIdle: boolean;
    start: () => void;
    success: () => void;
    failure: (e: ErrorInner) => void;
    clear: () => void;
}

export class RequestStateModel<T = void> implements IRequestStateModel<T> {
    state: LoadingState = LoadingState.IDLE;

    isLoaded = false;

    error: ErrorInner | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    start() {
        this.state = LoadingState.REQUEST;
        this.error = null;
    }

    success() {
        this.state = LoadingState.SUCCESS;
        this.isLoaded = true;
    }

    failure(e: ErrorInner) {
        this.state = LoadingState.FAILURE;
        this.error = e;
    }

    async run(fn: (() => Promise<T>) | (() => T)) {
        if (this.isLoading) {
            return undefined;
        }

        try {
            this.start();
            const res = await fn();
            this.success();
            return res;
        } catch (e) {
            this.failure(e as Error);
            throw e;
        }
    }

    clear() {
        this.state = LoadingState.IDLE;
        this.isLoaded = false;
        this.error = null;
    }

    get isLoading() {
        return this.state === LoadingState.REQUEST;
    }

    get isIdle() {
        return this.state === LoadingState.IDLE;
    }

    get isSuccess() {
        return this.state === LoadingState.SUCCESS;
    }

    get isError() {
        return this.state === LoadingState.FAILURE;
    }
}
