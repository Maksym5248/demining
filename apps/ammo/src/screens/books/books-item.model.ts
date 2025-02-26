import { makeAutoObservable } from 'mobx';
import { bookTypesMap } from 'shared-my';
import { type IBookData, type IBook, type IExplosive, type IExplosiveDevice, type IExplosiveObject, RequestModel } from 'shared-my-client';

import { BookCache } from '~/services';

export type Item = IExplosive | IExplosiveObject | IExplosiveDevice;

export interface IDataItem {
    id: string;
    data: IBookData;
    imageUri: string;
    displayName: string;
    isLoaded: boolean;
    typeName: string;
    openItem(): void;
}

export class DataItem implements IDataItem {
    isLoaded = false;

    constructor(public item: IBook) {
        makeAutoObservable(this);
    }

    openItem() {}

    setLoaded(value: boolean) {
        this.isLoaded = value;
    }

    load = new RequestModel({
        run: async () => {
            const exist = await BookCache.exists(this.id);
            this.setLoaded(exist);
        },
    });

    get imageUri() {
        return this.item.data.imageUri;
    }

    get data() {
        return this.item.data;
    }

    get displayName() {
        return this.item.displayName;
    }

    get id() {
        return this.item.id;
    }

    get typeName() {
        return bookTypesMap?.[this.data.type]?.name;
    }
}
