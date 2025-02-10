import { makeAutoObservable } from 'mobx';
import {
    DebounceModel,
    type IDebounceModel,
    type IInfiniteScrollModel,
    InfiniteScrollModel,
    type IOrderModel,
    type ISearchModel,
    OrderBy,
    OrderModel,
    SearchModel,
} from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { SearchItem, type Item, type ISearchItem } from './search-item.model';

export interface ISearchVM extends ViewModel {
    setSearchBy(value: string): void;
    loadMore(): void;
    searchBy: string;
    asArray: ISearchItem[];
    isLoading: boolean;
    isLoadingMore: boolean;
    isEndReached: boolean;
}

export class SearchVM implements ISearchVM {
    search: ISearchModel<Item>;
    order: IOrderModel<Item>;
    debounce: IDebounceModel = new DebounceModel();
    debounceMore: IDebounceModel = new DebounceModel();
    infiniteScroll: IInfiniteScrollModel<Item>;

    value = '';

    constructor() {
        this.search = new SearchModel(this.merged, {
            fields: ['displayName'],
        });

        this.order = new OrderModel(this.search, {
            orderField: 'displayName',
            orderBy: OrderBy.Asc,
        });

        this.infiniteScroll = new InfiniteScrollModel(this.order);

        makeAutoObservable(this);
    }

    unmount() {
        this.search.clear();
        this.debounce.clear();
        this.infiniteScroll.clear();
        this.value = '';
    }

    setSearchBy(value: string) {
        this.value = value;

        this.debounce.run(() => {
            this.search.setSearchBy(value);
            this.infiniteScroll.clear();
        });
    }

    loadMore() {
        this.debounceMore.run(() => {
            this.infiniteScroll.loadMore();
        });
    }

    get searchBy() {
        return this.value;
    }

    get merged() {
        return {
            asArray: [...stores.explosive.list.asArray, ...stores.explosiveObject.list.asArray, ...stores.explosiveDevice.list.asArray],
        };
    }

    get asArray() {
        return this.infiniteScroll.asArray.map(item => new SearchItem(item));
    }

    get isEndReached() {
        return this.infiniteScroll.isEndReached;
    }

    get isLoading() {
        return this.debounce.isLoading;
    }

    get isLoadingMore() {
        return this.debounceMore.isLoading;
    }
}

export const searchVM = new SearchVM();
