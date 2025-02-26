import { makeAutoObservable } from 'mobx';
import {
    DebounceModel,
    FiltersModel,
    InfiniteScrollModel,
    OrderBy,
    OrderModel,
    SearchModel,
    type IDebounceModel,
    type IFiltersModel,
    type IOrderModel,
    type ISearchModel,
    type IInfiniteScrollModel,
} from 'shared-my-client';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { stores } from '~/stores';
import { BookLoadedState, type IBookFilter, type ViewModel } from '~/types';

import { type IDataItem, DataItem, STATUS } from './books-item.model';

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

export class SearchVM implements ISearchVM {
    filters: IFiltersModel<IBookFilter, IDataItem>;
    search: ISearchModel<IDataItem>;
    order: IOrderModel<IDataItem>;
    debounce: IDebounceModel = new DebounceModel();
    debounceMore: IDebounceModel = new DebounceModel();
    infiniteScroll: IInfiniteScrollModel<IDataItem>;

    value = '';

    constructor() {
        this.filters = new FiltersModel(this.data, {
            rules: [
                {
                    key: 'type',
                    rule: (item, value) => value === item.data.type,
                },
                {
                    key: 'loadState',
                    rule: (item, value: BookLoadedState) => {
                        if (value === BookLoadedState.NOT_LOADED) return item.status !== STATUS.LOADED;
                        if (value === BookLoadedState.LOADED) return item.status === STATUS.LOADED;

                        return true;
                    },
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

        this.infiniteScroll = new InfiniteScrollModel(this.order, {
            size: 10,
        });

        makeAutoObservable(this);
    }

    clearFilters() {
        this.filters.clear();
    }

    init(filters?: IBookFilter) {
        this.filters.set({
            ...filters,
            loadState: filters?.loadState ?? BookLoadedState.ALL,
        });
    }

    unmount() {
        this.search.clear();
        this.debounce.clear();
        this.infiniteScroll.clear();
        this.filters.clear();
        this.value = '';
    }

    openFilters() {
        const onSelect = (filters: IBookFilter) => {
            this.filters.set(filters);
            this.infiniteScroll.clear();
        };

        Modal.show(MODALS.FILTER_BOOKS, {
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
        return this.filters.count - (this.filters.values.loadState === BookLoadedState.ALL ? 1 : 0);
    }

    get searchBy() {
        return this.value;
    }

    get data() {
        return {
            asArray: stores.book.list.asArray.map(item => new DataItem(item)),
        };
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
