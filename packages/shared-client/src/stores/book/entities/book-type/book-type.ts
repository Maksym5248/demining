import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type IBookTypeData } from './book-type.schema';

export interface IBookType extends IDataModel<IBookTypeData> {
    displayName: string;
    updateFields(data: Partial<IBookTypeData>): void;
}

export class BookType implements IBookType {
    data: IBookTypeData;

    constructor(data: IBookTypeData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IBookTypeData>) {
        Object.assign(this.data, data);
    }
}
