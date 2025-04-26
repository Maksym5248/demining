import { makeAutoObservable } from 'mobx';

import { ErrorModel, type IErrorModel } from '~/common';
import { Logger } from '~/services';

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
    cachePolicy?: 'cache-first' | 'network-only';
}

export class RequestModel<Params extends Array<any> = undefined[], Return = void> implements IRequestModel<Params, Return> {
    protected requestState = new RequestStateModel<Params>();

    private _shouldRun?: (...args: Params) => boolean;
    private _run: (...args: Params) => Promise<Return | void> | Return | void;
    private _onError?: (e?: IErrorModel) => void;
    private _onSuccuss?: () => void;
    private _returnIfLoaded = false;
    _cachePolicy?: 'cache-first' | 'network-only';

    constructor(params: IRequestModelParams<Params, Return>) {
        this._shouldRun = params?.shouldRun;
        this._run = params?.run;
        this._onError = params?.onError;
        this._onSuccuss = params?.onSuccuss;
        this._returnIfLoaded = !!params?.returnIfLoaded;
        this._cachePolicy = params?.cachePolicy ?? 'network-only';

        makeAutoObservable(this);
    }

    async run(...args: Params): Promise<Return | void> {
        let res: Return | void;

        try {
            if (this._returnIfLoaded && this.requestState.isLoaded) return;
            if (this._cachePolicy === 'cache-first' && this.requestState.isLoaded) return;
            if (this._shouldRun && !this._shouldRun(...args)) return;

            this.requestState.start();

            res = await this._run(...args);

            this._onSuccuss?.();
            this.requestState.success();
        } catch (e) {
            const error = new ErrorModel(e as Error);

            this._onError?.(error);
            this.requestState.failure(error);
            Logger.error(error.message);
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
