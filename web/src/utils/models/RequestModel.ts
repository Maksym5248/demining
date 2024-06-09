import { makeAutoObservable } from 'mobx';

import { RequestStateModel } from './RequestStateModel';

export interface IRequestModel<Params extends Array<any> = [], Return = void> {
    run: (...args: Params) => Promise<Return | void> | Return | void;
    isLoading: boolean;
}

export interface IRequestModelParams<Params extends Array<any> = [], Return = void> {
    shouldRun?: (...args: Params) => boolean;
    run: (...args: Params) => Promise<Return | void> | Return | void;
    onError?: () => void;
    onSuccuss?: () => void;
}

export class RequestModel<Params extends Array<any> = [], Return = void> implements IRequestModel<Params, Return> {
    protected requestState = new RequestStateModel<Params>();

    private _shouldRun?: (...args: Params) => boolean;
    private _run: (...args: Params) => Promise<Return | void> | Return | void;
    private _onError?: (e?: Error) => void;
    private _onSuccuss?: (e?: Error) => void;

    constructor(params: IRequestModelParams<Params, Return>) {
        this._shouldRun = params?.shouldRun;
        this._run = params?.run;
        this._onError = params?.onError;
        this._onSuccuss = params?.onSuccuss;

        makeAutoObservable(this);
    }

    async run(...args: Params): Promise<Return | void> {
        try {
            if (this._shouldRun && !this._shouldRun(...args)) return;
            this.requestState.start();
            await this._run(...args);
            this._onSuccuss?.();
            this.requestState.success();
        } catch (e) {
            this._onError?.(e as Error);
            this.requestState.failure(e as Error);
            throw e;
        }
    }

    get isLoading() {
        return this.requestState.isLoading;
    }
}
