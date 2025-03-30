import { makeAutoObservable } from 'mobx';

import { type IData, type IDataModel } from './DataModel';
import { type IListModel } from './ListModel';

export interface IInfiniteScrollModel<T> {
    size: number;
    page: number;
    total: number;
    totalVisible: number;
    isEndReached: boolean;
    asArray: T[];
    loadMore: () => void;
    clear: () => void;
}

export interface IInfiniteScrollModelParams {
    size?: number;
}

export class InfiniteScrollModel<T extends IDataModel<B>, B extends IData> implements IInfiniteScrollModel<T> {
    size: number;
    page: number = 1;

    constructor(
        private list: Pick<IListModel<T, B>, 'asArray'>,
        params?: IInfiniteScrollModelParams,
    ) {
        this.size = params?.size ?? 20;

        makeAutoObservable(this);
    }

    clear() {
        this.page = 1;
    }

    loadMore() {
        if (this.isEndReached) return;
        this.page++;
    }

    get total() {
        return this.list.asArray.length;
    }

    get totalVisible() {
        return this.size * this.page;
    }

    get isEndReached() {
        return this.totalVisible >= this.total;
    }

    get asArray() {
        return this.list.asArray.slice(0, this.totalVisible);
    }
}
