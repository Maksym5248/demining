import { makeAutoObservable } from 'mobx';
import {
    DebounceModel,
    Explosive,
    ExplosiveDevice,
    ExplosiveObject,
    FiltersModel,
    type IDebounceModel,
    type IExplosive,
    type IExplosiveDevice,
    type IExplosiveObject,
    type IFiltersModel,
    type IInfiniteScrollModel,
    InfiniteScrollModel,
    type IOrderModel,
    type ISearchModel,
    OrderBy,
    OrderModel,
    SearchModel,
} from 'shared-my-client';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { stores } from '~/stores';
import { DictionaryType, type IDictionatyFilter, type ViewModel } from '~/types';

import { type IDataItem, type Item, DataItem } from './search-item.model';

export interface ISearchVM extends ViewModel {
    openFilters(): void;
    setSearchBy(value: string): void;
    loadMore(): void;
    searchBy: string;
    asArray: IDataItem[];
    isLoading: boolean;
    isLoadingMore: boolean;
    isEndReached: boolean;
    filtersCount: number;
}

const isExplosiveDevice = (item: Item): item is IExplosiveDevice => item instanceof ExplosiveDevice;
const isExplosiveObject = (item: Item): item is IExplosiveObject => item instanceof ExplosiveObject;
const isExplosive = (item: Item): item is IExplosive => item instanceof Explosive;

export class SearchVM implements ISearchVM {
    filters: IFiltersModel<IDictionatyFilter, Item>;
    search: ISearchModel<Item>;
    order: IOrderModel<Item>;
    debounce: IDebounceModel = new DebounceModel();
    debounceMore: IDebounceModel = new DebounceModel();
    infiniteScroll: IInfiniteScrollModel<Item>;

    value = '';

    constructor() {
        this.filters = new FiltersModel(this.merged, {
            rules: [
                {
                    key: 'type',
                    rule: (item, value) => {
                        if (isExplosive(item)) return value === DictionaryType.Explosive;
                        if (isExplosiveObject(item)) return value === DictionaryType.ExplosiveObject;
                        return value === DictionaryType.ExplosiveDevices;
                    },
                },
                {
                    key: 'explosiveObject.typeId',
                    rule: (item, value) => !isExplosiveObject(item) || item.data.typeId === value,
                },
                {
                    key: 'explosiveObject.classItemId',
                    rule: (item, value) => !isExplosiveObject(item) || (!!value && item.classItemIds.includes(value)),
                },
                {
                    key: 'explosiveDevice.type',
                    rule: (item, value) => !isExplosiveDevice(item) || item.data.type === value,
                },
            ],
        });

        this.search = new SearchModel(this.filters, {
            fields: ['displayName'],
        });

        this.order = new OrderModel(this.search, {
            orderField: 'displayName',
            orderBy: OrderBy.Asc,
        });

        this.infiniteScroll = new InfiniteScrollModel(this.order);

        makeAutoObservable(this);
    }

    clearFilters() {
        this.filters.clear();
    }

    init(filters?: IDictionatyFilter) {
        this.filters.set(filters);
    }

    unmount() {
        this.search.clear();
        this.debounce.clear();
        this.infiniteScroll.clear();
        this.filters.clear();
        this.value = '';
    }

    openFilters() {
        const onSelect = (filters: IDictionatyFilter) => {
            this.filters.set(filters);
            this.infiniteScroll.clear();
        };

        Modal.show(MODALS.FILTER_DICTIONARY, {
            filters: this.filters.values,
            onSelect,
        });
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

    get filtersCount() {
        return this.filters.count;
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
        return this.infiniteScroll.asArray.map(item => new DataItem(item));
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
