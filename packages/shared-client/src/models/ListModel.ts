import { isArray } from 'lodash';
import { makeAutoObservable } from 'mobx';

import { type Path } from '~/common';

import { type ICollectionModel } from './CollectionModel';
import { type IData, type IDataModel } from './DataModel';

export interface IListModel<T extends IDataModel<B>, B extends IData> {
    push: (value: B | B[], isUniqueEnabled?: boolean) => void;
    unshift: (value: B | B[], isUniqueEnabled?: boolean) => void;
    set: (arr: B[]) => void;
    clear: () => void;
    checkMore: (length: number) => void;
    setMore: (isMore: boolean) => void;
    map: <U>(callback: (value: T, index: number, array: T[]) => U) => U[];
    remove: (ids: string | string[]) => void;
    pageSize: number;
    isEmpty: boolean;
    isMorePages: boolean;
    length: number;
    asArray: T[];
    last: T;
    first: T;
    pages: number;
}

export interface ListModelParams<T extends IDataModel<B>, B extends IData> {
    pageSize?: number;
    collection: ICollectionModel<T, B>;
}

export class ListModel<T extends IDataModel<B>, B extends IData> implements IListModel<T, B> {
    private ids: string[] = [];

    public pageSize = 0;
    public isMorePages = true;

    private collection: ICollectionModel<T, B>;

    searchKeys?: Path<T>[];

    constructor(params: ListModelParams<T, B>) {
        this.pageSize = params?.pageSize ?? 10;
        this.collection = params.collection;

        this.collection?.onRemoved?.(id => {
            this.remove(id);
        });

        makeAutoObservable(this);
    }

    checkMore(length: number) {
        this.isMorePages = length >= this.pageSize;
    }

    setMore(isMore: boolean) {
        this.isMorePages = isMore;
    }

    set(arr: B[]) {
        this.collection.set(arr);
        this.ids = arr.map(item => item.id);

        this.checkMore(arr.length);
    }

    push(value: B | B[]) {
        const newItems = Array.isArray(value) ? value : [value];
        const items = newItems as (B & { id: string })[];

        this.collection.set(items);
        this.ids.push(...items.map(el => el.id));

        if (isArray(value)) this.checkMore(value.length);
    }

    unshift(value: B | B[]) {
        const newItems = Array.isArray(value) ? value : [value];
        const items = newItems as (B & { id: string })[];

        this.collection.set(items);
        this.ids.unshift(...items.map(el => el.id));

        if (isArray(value)) this.checkMore(value.length);
    }

    clear() {
        this.ids = [];
        this.isMorePages = true;
    }

    includes(id: string) {
        return this.ids.includes(id);
    }

    remove(ids: string | string[]) {
        const idsToRemove = Array.isArray(ids) ? ids : [ids];
        this.ids = this.ids.filter(id => !idsToRemove.includes(id));
    }

    map<U>(callback: (value: T, index: number, array: T[]) => U) {
        return this.asArray.map(callback);
    }

    get asArray() {
        return this.ids.map(id => this.collection?.get(id) as T);
    }

    get length() {
        return this.asArray.length;
    }

    get isEmpty() {
        return !this.length;
    }

    get last() {
        return this.asArray[this.length - 1];
    }

    get first() {
        return this.asArray[0];
    }

    get pages() {
        return Math.ceil(this.length / this.pageSize) - 1;
    }
}
