import { makeAutoObservable } from 'mobx';

import { type ICommonAPI } from '~/api';
import { CollectionModel, type IListModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { Country, createCountry, type ICountry, type ICountryData } from './entities';

interface IApi {
    common: ICommonAPI;
}

interface IServices {
    message: IMessage;
}

export interface ICommonStore {
    collectionCountries: CollectionModel<ICountry, ICountryData>;
    listCountries: IListModel<ICountry, ICountryData>;
    subscribeCountries: RequestModel;
}

export class CommonStore implements ICommonStore {
    api: IApi;
    services: IServices;

    collectionCountries = new CollectionModel<ICountry, ICountryData>({
        factory: (data: ICountryData) => new Country(data),
    });

    listCountries = new ListModel<ICountry, ICountryData>({
        collection: this.collectionCountries,
    });

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get collections() {
        return {
            country: this.collectionCountries,
        };
    }

    subscribeCountries = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            const countries = await this.api.common.getCountriesList();

            this.listCountries.set(countries.map(createCountry));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
