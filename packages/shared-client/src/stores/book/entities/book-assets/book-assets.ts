import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type IBookAssetsPageData, type IBookAssetsData } from './book-assets.schema';

export interface IBookAssets extends IDataModel<IBookAssetsData> {
    updateFields(data: Partial<IBookAssetsData>): void;
    getPage(pageNumber: number): IBookAssetsPageData | undefined;
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

    getPage(pageNumber: number) {
        return this.data.pages.find(page => page.page === pageNumber);
    }

    updateFields(data: Partial<IBookAssetsData>) {
        Object.assign(this.data, data);
    }
}
