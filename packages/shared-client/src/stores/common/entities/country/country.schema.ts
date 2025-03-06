import { type ICountryDTO } from '~/api';

export interface ICountryData {
    id: string;
    name: string;
}

export const createCountry = (value: ICountryDTO): ICountryData => ({
    id: value.id,
    name: value.name,
});
