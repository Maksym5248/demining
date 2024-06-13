import { type IAddressDTO } from '~/api';

export interface IAddressValue {
    city?: string;
    country?: string;
    district?: string;
    housenumber?: string;
    postcode?: string;
    state?: string;
    street?: string;
    municipality?: string;
}

export const createAddressDTO = (value?: IAddressValue): IAddressDTO => ({
    city: value?.city ?? null,
    country: value?.country ?? null,
    district: value?.district ?? null,
    housenumber: value?.housenumber ?? null,
    postcode: value?.postcode ?? null,
    state: value?.state ?? null,
    street: value?.street ?? null,
    municipality: value?.municipality ?? null,
});

export const createAddress = (value?: IAddressDTO): IAddressValue => ({
    city: value?.city ?? undefined,
    country: value?.country ?? undefined,
    district: value?.district ?? undefined,
    housenumber: value?.housenumber ?? undefined,
    postcode: value?.postcode ?? undefined,
    state: value?.state ?? undefined,
    street: value?.street ?? undefined,
    municipality: value?.street ?? undefined,
});

export class AddressValue {
    constructor(value: IAddressValue) {
        this.city = value.city;
        this.country = value.country;
        this.district = value.district;
        this.housenumber = value.housenumber;
        this.postcode = value.postcode;
        this.state = value.state;
        this.street = value.street;
        this.municipality = value.municipality;
    }

    city?: string;
    country?: string;
    district?: string;
    housenumber?: string;
    postcode?: string;
    state?: string;
    street?: string;
    municipality?: string;
}
