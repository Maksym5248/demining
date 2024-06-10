import { makeAutoObservable } from 'mobx';

import { CollectionModel } from './CollectionModel';

export interface IListModel<T extends B, B extends { id: string }> {
    push: (value: B | B[], isUniqueEnabled: boolean) => void;
    unshift: (value: B | B[], isUniqueEnabled: boolean) => void;
    set: (arr: B[]) => void;
    clear: () => void;
    checkMore: (length: number) => void;
    setMore: (isMore: boolean) => void;

    // remove: (ids: string | string[]) => void;
    removeById: (ids: string | string[]) => void;
    pageSize: number;
    isEmpty: boolean;
    isMorePages: boolean;
    length: number;
    asArray: T[];
}

export interface ListModelParams<T extends B, B extends { id: string }> {
    pageSize?: number;
    collection: CollectionModel<T, B>;
}

export class ListModel<T extends B, B extends { id: string }> implements IListModel<T, B> {
    private ids: string[] = [];

    public pageSize = 0;
    public isMorePages = true;

    private collection: CollectionModel<T, B>;

    constructor(params: ListModelParams<T, B>) {
        this.pageSize = params?.pageSize ?? 10;
        this.collection = params.collection;

        makeAutoObservable(this);
    }

    checkMore(length: number) {
        this.isMorePages = length >= this.pageSize;
    }

    setMore(isMore: boolean) {
        this.isMorePages = isMore;
    }

    set(arr: B[]) {
        this.collection.setArr(arr);
        this.ids = arr.map((item) => item.id);
    }

    push(value: B | B[], isUniqueEnabled = false) {
        const newItems = Array.isArray(value) ? value : [value];
        const items = newItems as (B & { id: string })[];

        const data = isUniqueEnabled ? items.filter((el) => !this.ids.includes(el.id)) : items;

        this.collection.setArr(data);
        this.ids.push(...data.map((el) => el.id));
    }

    unshift(value: B | B[], isUniqueEnabled = false) {
        const newItems = Array.isArray(value) ? value : [value];
        const items = newItems as (B & { id: string })[];

        const data = isUniqueEnabled ? items.filter((el) => !this.ids.includes(el.id)) : items;

        this.collection.setArr(data);
        this.ids.unshift(...data.map((el) => el.id));
    }

    clear() {
        this.ids = [];
    }

    includes(id: string) {
        return this.ids.includes(id);
    }

    // TODO: remove by index
    // remove(index: number | number[]) {
    //     const indexToRemove = Array.isArray(index) ? index : [index];

    //     this.setTotal(this.total - indexToRemove.length);

    //     this.ids = this.ids.filter((id) => !idsToRemove.includes(id));

    //     if (this.collection) {
    //         this.arr = (this.arr as (T & { id: string | number })[]).filter(
    //             ({ id }) => !idsToRemove.includes(id),
    //         );
    //     }
    // }

    removeById(ids: string | string[]) {
        const idsToRemove = Array.isArray(ids) ? ids : [ids];
        this.ids = this.ids.filter((id) => !idsToRemove.includes(id));
    }

    get asArray() {
        return this.ids.map((id) => this.collection?.get(id) as T);
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
