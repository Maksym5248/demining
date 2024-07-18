import { makeAutoObservable } from 'mobx';

import { type ICountryData } from './country.schema';

export interface ICountry {
    data: ICountryData;
    displayName: string;
    updateFields(data: Partial<ICountryData>): void;
}

export class Country implements ICountry {
    data: ICountryData;

    constructor(data: ICountryData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<ICountryData>) {
        Object.assign(this.data, data);
    }
}
