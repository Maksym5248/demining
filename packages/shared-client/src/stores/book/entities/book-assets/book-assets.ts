import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type IBookAssetsData } from './book-assets.schema';

export interface IBookAssets extends IDataModel<IBookAssetsData> {
    updateFields(data: Partial<IBookAssetsData>): void;
}

export class BookAssets implements IBookAssets {
    data: IBookAssetsData;

    constructor(data: IBookAssetsData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<IBookAssetsData>) {
        Object.assign(this.data, data);
    }
}
