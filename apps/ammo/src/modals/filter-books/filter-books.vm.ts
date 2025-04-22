import { makeAutoObservable } from 'mobx';
import { type BOOK_TYPE } from 'shared-my';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { stores } from '~/stores';
import { type ViewModel, type IBookFilter, type IOption, BookLoadedState } from '~/types';

export interface IFilterDictionariesVM extends ViewModel {
    types: IOption<BOOK_TYPE>[];
    selectedType: IOption<BOOK_TYPE> | undefined;
    loaded: IOption<BookLoadedState>[];
    setType(type?: BOOK_TYPE): void;
    openTypeSelect(): void;
    clear(): void;
    removeType(): void;
    setLoadedState(value: BookLoadedState): void;
    filters: IBookFilter;
}

export const loadedOptions: IOption<BookLoadedState>[] = [
    {
        value: BookLoadedState.ALL,
        title: 'all',
    },
    {
        value: BookLoadedState.LOADED,
        title: 'loaded',
    },
    {
        value: BookLoadedState.NOT_LOADED,
        title: 'not-loaded',
    },
];

export class FilterDictionariesVM implements IFilterDictionariesVM {
    type?: BOOK_TYPE = undefined;
    loadState: BookLoadedState = BookLoadedState.ALL;

    constructor() {
        makeAutoObservable(this);
    }

    init(filter: Partial<IBookFilter>) {
        this.type = filter?.type;
        this.loadState = filter?.loadState ?? BookLoadedState.ALL;
    }

    clear() {
        this.type = undefined;
        this.loadState = BookLoadedState.ALL;
    }

    unmount() {
        this.clear();
    }

    setType(value?: BOOK_TYPE) {
        this.type = value === this.type ? undefined : value;
    }

    setLoadedState(value: BookLoadedState) {
        this.loadState = value;
    }

    removeType() {
        this.type = undefined;
    }

    openTypeSelect() {
        const onSelect = (option: IOption<BOOK_TYPE>[]) => {
            this.setType(option[0]?.value);
        };

        Modal.show(MODALS.SELECT, {
            value: this.filters.type,
            options: this.types,
            onSelect,
        });
    }

    get filters() {
        return {
            type: this.type,
            loadState: this.loadState,
        };
    }

    get types() {
        return stores.book.collectionBookType.asArray.map(
            type =>
                ({
                    title: type.data.name,
                    value: type.id,
                }) as IOption<BOOK_TYPE>,
        );
    }

    get selectedType() {
        return this.types.find(option => option.value === this.type);
    }

    get loaded() {
        return loadedOptions;
    }
}

export const filterDictionariesVM = new FilterDictionariesVM();
