import { makeAutoObservable } from 'mobx';
import {
    DebounceModel,
    Explosive,
    ExplosiveObject,
    type IDebounceModel,
    type IExplosive,
    type IExplosiveDevice,
    type IExplosiveObject,
    type IInfiniteScrollModel,
    InfiniteScrollModel,
    type INode,
    type IOrderModel,
    type ISearchModel,
    OrderModel,
    SearchModel,
} from 'shared-my-client';

import { stores } from '~/stores';
import { DictionaryType, type ViewModel } from '~/types';

export type Item = IExplosive | IExplosiveObject | IExplosiveDevice;

export interface ISearchVM extends ViewModel {
    setSearchBy(value: string): void;
    loadMore(): void;
    getClassficationNames(id: string, type: DictionaryType): string[];
    getTypeName(id: string, type: DictionaryType): string | undefined;
    searchBy: string;
    asArray: Item[];
    isLoading: boolean;
    isLoadingMore: boolean;
    isEndReached: boolean;
}

export const getType = (item: Item): DictionaryType => {
    if (item instanceof Explosive) {
        return DictionaryType.Explosive;
    }

    if (item instanceof ExplosiveObject) {
        return DictionaryType.ExplosiveObject;
    }

    return DictionaryType.ExplosiveDevices;
};

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

    getTypeName(id: string, type: DictionaryType) {
        if (type === DictionaryType.ExplosiveObject) {
            const item = stores.explosiveObject.collection.get(id);

            return item?.type?.displayName;
        }

        return undefined;
    }

    getClassficationNames(id: string, type: DictionaryType) {
        if (type === DictionaryType.ExplosiveObject) {
            const item = stores.explosiveObject.collection.get(id);

            const classification = item?.data?.classItemIds?.map(id => stores.explosiveObject.classifications.get(id));

            return (
                classification?.reduce((acc: string[], c: INode) => {
                    c.parents?.forEach(parent => {
                        acc.push(parent.item.displayName);
                    });
                    acc.push(c.item.displayName);

                    return acc;
                }, [] as string[]) ?? []
            );
        }

        return [];
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
