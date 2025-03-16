import { makeAutoObservable } from 'mobx';
import { type APPS } from 'shared-my';

import { type ICommonAPI } from '~/api';
import { CollectionModel, type IListModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { AppConfig, Country, createAppConfig, createCountry, type ICountry, type ICountryData } from './entities';

interface IApi {
    common: ICommonAPI;
}

interface IServices {
    message: IMessage;
}

export interface ICommonStore {
    appConfig: AppConfig;
    collectionCountries: CollectionModel<ICountry, ICountryData>;
    listCountries: IListModel<ICountry, ICountryData>;
    subscribeCountries: RequestModel;
    fetchAppConfig: RequestModel;
}

export class CommonStore implements ICommonStore {
    api: IApi;
    services: IServices;

    appConfig = new AppConfig();

    collectionCountries = new CollectionModel<ICountry, ICountryData>({
        factory: (data: ICountryData) => new Country(data),
    });

    listCountries = new ListModel<ICountry, ICountryData>({
        collection: this.collectionCountries,
    });

    constructor(
        public appName: APPS,
        params: { api: IApi; services: IServices },
    ) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get collections() {
        return {
            country: this.collectionCountries,
        };
    }

    fetchAppConfig = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            const config = await this.api.common.getAppConfig(this.appName);

            if (!this.appConfig.platform) {
                throw new Error('Platform is not set');
            }

            this.appConfig.set(createAppConfig(this.appConfig.platform, config));
        },
    });

    subscribeCountries = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            const countries = await this.api.common.getCountriesList();

            this.listCountries.set(countries.map(createCountry));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
