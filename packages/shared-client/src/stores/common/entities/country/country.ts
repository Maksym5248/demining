import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type ICountryData } from './country.schema';

export interface ICountry extends IDataModel<ICountryData> {
    displayName: string;
    updateFields(data: Partial<ICountryData>): void;
}

export class Country implements ICountry {
    data: ICountryData;

    constructor(data: ICountryData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<ICountryData>) {
        Object.assign(this.data, data);
    }
}
