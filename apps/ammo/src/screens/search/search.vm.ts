import { makeAutoObservable } from 'mobx';
import {
    DebounceModel,
    type IDebounceModel,
    type IExplosive,
    type IExplosiveDevice,
    type IExplosiveObject,
    type IInfiniteScrollModel,
    InfiniteScrollModel,
    type IOrderModel,
    type ISearchModel,
    OrderModel,
    SearchModel,
} from 'shared-my-client';

import { type ISvgName } from '~/core';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export enum IDictionaryType {
    Explosive = 'explosive',
    ExplosiveObject = 'explosive-object',
    ExplosiveDevices = 'explosive-device',
}

export interface ICategory {
    id: string;
    type: string;
    svg: ISvgName;
}

export type Item = IExplosive | IExplosiveObject | IExplosiveDevice;

export interface ISearchVM extends ViewModel {
    setSearchBy(value: string): void;
    loadMore(): void;
    searchBy: string;
    asArray: Item[];
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
        this.search = new SearchModel(
            { asArray: this.merged },
            {
                fields: ['displayName'],
            },
        );

        this.order = new OrderModel(this.search, {
            orderField: 'displayName',
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
        return [...stores.explosive.list.asArray, ...stores.explosiveObject.list.asArray, ...stores.explosiveDevice.list.asArray];
    }

    get asArray() {
        return this.infiniteScroll.asArray;
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
