import { AddressValue, type IAddressValue } from './address.schema';

export type IAddress = IAddressValue;

export class Address extends AddressValue {
    constructor(value: IAddressValue) {
        super(value);
    }
}
