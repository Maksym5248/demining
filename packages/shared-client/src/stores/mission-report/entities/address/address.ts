import { makeAutoObservable } from 'mobx';

import { type IAddressData } from './address.schema';

export interface IAddress {
    data: IAddressData;
}

export class Address {
    data: IAddressData;

    constructor(data: IAddressData) {
        this.data = data;

        makeAutoObservable(this);
    }
}
