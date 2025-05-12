import { makeAutoObservable } from 'mobx';
import { type APPS } from 'shared-my';

import { type ICountryDTO, type ICommonAPI, type IStatusDTO, type IMaterialDTO } from '~/api';
import { type ISubscriptionDocument } from '~/common';
import { CollectionModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    AppConfig,
    Country,
    createAppConfig,
    createCountry,
    type IStatus,
    type IStatusData,
    type ICountry,
    type ICountryData,
    Status,
    createStatus,
    type IMaterial,
    type IMaterialData,
    Material,
    createMaterial,
} from './entities';

interface IApi {
    common: ICommonAPI;
}

interface IServices {
    message: IMessage;
}

export interface ICommonStore {
    appConfig: AppConfig;
    collections: {
        countries: CollectionModel<ICountry, ICountryData>;
        statuses: CollectionModel<IStatus, IStatusData>;
        materials: CollectionModel<IMaterial, IMaterialData>;
    };
    syncCountries: RequestModel;
    syncStatuses: RequestModel;
    syncMaterials: RequestModel;
    fetchAppConfig: RequestModel;
}

export class CommonStore implements ICommonStore {
    api: IApi;
    services: IServices;

    appConfig = new AppConfig();

    collections = {
        countries: new CollectionModel<ICountry, ICountryData>({
            factory: (data: ICountryData) => new Country(data),
        }),
        statuses: new CollectionModel<IStatus, IStatusData>({
            factory: (data: IStatusData) => new Status(data),
        }),
        materials: new CollectionModel<IMaterial, IMaterialData>({
            factory: (data: IMaterialData) => new Material(data),
        }),
    };

    constructor(
        public appName: APPS,
        params: { api: IApi; services: IServices },
    ) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
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

    syncCountries = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            await this.api.common.syncCountry({}, (values: ISubscriptionDocument<ICountryDTO>[]) => {
                const create: ICountryData[] = [];
                const update: ICountryData[] = [];
                const remove: string[] = [];

                values.forEach(value => {
                    if (value.type === 'removed') {
                        remove.push(value.data.id);
                    } else if (value.type === 'added') {
                        create.push(createCountry(value.data));
                    } else if (value.type === 'modified') {
                        update.push(createCountry(value.data));
                    }
                });

                this.collections.countries.set(create);
                this.collections.countries.update(update);
                this.collections.countries.remove(remove);
            });
        },
    });

    syncStatuses = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            await this.api.common.syncStatus({}, (values: ISubscriptionDocument<IStatusDTO>[]) => {
                const create: IStatusData[] = [];
                const update: IStatusData[] = [];
                const remove: string[] = [];

                values.forEach(value => {
                    if (value.type === 'removed') {
                        remove.push(value.data.id);
                    } else if (value.type === 'added') {
                        create.push(createStatus(value.data));
                    } else if (value.type === 'modified') {
                        update.push(createStatus(value.data));
                    }
                });

                this.collections.statuses.set(create);
                this.collections.statuses.update(update);
                this.collections.statuses.remove(remove);
            });
        },
    });

    syncMaterials = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            await this.api.common.syncMaterial({}, (values: ISubscriptionDocument<IMaterialDTO>[]) => {
                const create: IMaterialData[] = [];
                const update: IMaterialData[] = [];
                const remove: string[] = [];

                values.forEach(value => {
                    if (value.type === 'removed') {
                        remove.push(value.data.id);
                    } else if (value.type === 'added') {
                        create.push(createMaterial(value.data));
                    } else if (value.type === 'modified') {
                        update.push(createMaterial(value.data));
                    }
                });

                this.collections.materials.set(create);
                this.collections.materials.update(update);
                this.collections.materials.remove(remove);
            });
        },
    });
}
