import { makeAutoObservable } from 'mobx';

import { LoadingState, type Runnable } from '~/common';

import { ErrorModel, type IErrorModel } from './ErrorModel';

export interface IRequestStateModel<T = void> extends Runnable<T> {
    error: IErrorModel | null;
    isLoading: boolean;
    isLoaded: boolean;
    isIdle: boolean;
    start: () => void;
    success: () => void;
    failure: (e: IErrorModel) => void;
    clear: () => void;
}

export class RequestStateModel<T = void> implements IRequestStateModel<T> {
    state: LoadingState = LoadingState.IDLE;

    isLoaded = false;

    error: IErrorModel | null = null;

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

    failure(e: IErrorModel) {
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
            const error = new ErrorModel(e as Error);
            this.failure(error as IErrorModel);
            throw error;
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
