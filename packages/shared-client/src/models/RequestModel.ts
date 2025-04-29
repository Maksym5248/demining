import { makeAutoObservable } from 'mobx';

import { delay } from '~/common';
import { Logger } from '~/services';

import { ErrorModel, type IErrorModel } from './ErrorModel';
import { RequestStateModel } from './RequestStateModel';

export interface IRequestModel<Params extends Array<any> = undefined[], Return = void> {
    run: (...args: Params) => Promise<Return | void> | Return | void;
    isLoading: boolean;
    isLoaded: boolean;
    error: IErrorModel | null;
}

export interface IRequestModelParams<Params extends Array<any> = undefined[], Return = void> {
    shouldRun?: (...args: Partial<Params> | Params) => boolean;
    run: (...args: Params) => Promise<Return | void> | Return | void;
    onError?: (e?: IErrorModel) => void;
    onSuccuss?: () => void;
    returnIfLoaded?: boolean;
    returnIfLoading?: boolean;
    retry?: number;
    retryDelay?: number;
    cachePolicy?: 'cache-first' | 'network-only';
}

export class RequestModel<Params extends Array<any> = undefined[], Return = void> implements IRequestModel<Params, Return> {
    protected requestState = new RequestStateModel<Params>();

    private _shouldRun?: (...args: Params) => boolean;
    private _run: (...args: Params) => Promise<Return | void> | Return | void;
    private _onError?: (e?: IErrorModel) => void;
    private _onSuccuss?: () => void;
    private _returnIfLoaded = false;
    private _returnIfLoading = false;
    private _retry: number = 1;
    private _retryDelay = 1000;

    _cachePolicy?: 'cache-first' | 'network-only';

    constructor(params: IRequestModelParams<Params, Return>) {
        this._shouldRun = params?.shouldRun;
        this._run = params?.run;
        this._onError = params?.onError;
        this._onSuccuss = params?.onSuccuss;
        this._returnIfLoaded = !!params?.returnIfLoaded;
        this._returnIfLoading = !!params?.returnIfLoading;
        this._retry = params?.retry ?? 1;
        this._retryDelay = params?.retryDelay ?? 1000;
        this._cachePolicy = params?.cachePolicy ?? 'network-only';

        makeAutoObservable(this);
    }

    retry = async (...args: Params): Promise<Return | void> => {
        const retry = this._retry;
        const time = this._retryDelay;

        for (let i = 0; i < retry; i++) {
            try {
                const res = await this._run(...args);
                return res;
            } catch (e) {
                if (i === retry - 1) {
                    throw e;
                }
                console.log('Retrying request', i + 1, 'of', retry);
                await delay(time);
            }
        }
    };

    async run(...args: Params): Promise<Return | void> {
        let res: Return | void;

        try {
            if (this._returnIfLoaded && this.requestState.isLoaded) return;
            if (this._cachePolicy === 'cache-first' && this.requestState.isLoaded) return;
            if (this._shouldRun && !this._shouldRun(...args)) return;
            if (this._returnIfLoading && this.requestState.isLoading) return;

            this.requestState.start();

            res = await this.retry(...args);

            this._onSuccuss?.();
            this.requestState.success();
        } catch (e) {
            const error = new ErrorModel(e as Error);

            this._onError?.(error);
            this.requestState.failure(error);
            Logger.error((e as Error)?.message);
            throw error;
        }

        return res;
    }

    get isLoading() {
        return this.requestState.isLoading;
    }

    get isLoaded() {
        return this.requestState.isLoaded;
    }

    get error() {
        return this.requestState.error;
    }
}
