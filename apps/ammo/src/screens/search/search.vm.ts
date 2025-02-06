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
    type IOrderModel,
    type ISearchModel,
    OrderBy,
    OrderModel,
    SearchModel,
} from 'shared-my-client';

import { stores } from '~/stores';
import { DictionaryType, type ViewModel } from '~/types';

export type Item = IExplosive | IExplosiveObject | IExplosiveDevice;

export interface DataItem {
    id: string;
    data: Item;
    type: DictionaryType;
    typeName?: string;
    classItemsNames: string[];
}

export interface ISearchVM extends ViewModel {
    setSearchBy(value: string): void;
    loadMore(): void;
    searchBy: string;
    asArray: DataItem[];
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

    private getTypeName(id: string, type: DictionaryType) {
        if (type === DictionaryType.ExplosiveObject) {
            const item = stores.explosiveObject.collection.get(id);

            return item?.type?.displayName;
        }

        return undefined;
    }

    private getClassficationNames(id: string, type: DictionaryType) {
        if (type === DictionaryType.ExplosiveObject) {
            const item = stores.explosiveObject.collection.get(id);
            return item?.classItemsNames ?? [];
        }

        return [];
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
        return this.infiniteScroll.asArray.map(item => ({
            id: item.id,
            data: item,
            type: getType(item),
            typeName: this.getTypeName(item.id, getType(item)),
            classItemsNames: this.getClassficationNames(item.id, getType(item)),
        }));
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
