import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import {
    type IExplosiveObjectTypeAPI,
    type IExplosiveObjectAPI,
    type IExplosiveObjectActionSumDTO,
    type IExplosiveObjectClassAPI,
    type IExplosiveObjectClassItemAPI,
} from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { Classifications, type IClassifications } from './classifications';
import {
    ExplosiveObject,
    createExplosiveObjectDTO,
    createExplosiveObjectActionSum,
    ExplosiveObjectAction,
    Country,
    createCountry,
    ExplosiveObjectDetails,
    createExplosiveObject,
    createExplosiveObjectDetails,
    type IExplosiveObject,
    type IExplosiveObjectData,
    type IExplosiveObjectDataParams,
    type IExplosiveObjectActionData,
    type IExplosiveObjectAction,
    type ICountry,
    type ICountryData,
    type IExplosiveObjectDetailsData,
    type IExplosiveObjectDetails,
} from './entities';
import { ExplosiveObjectClassStore, type IExplosiveObjectClassStore } from './explosive-object-class';
import { ExplosiveObjectClassItemStore, type IExplosiveObjectClassItemStore } from './explosive-object-class-item';
import { ExplosiveObjectTypeStore, type IExplosiveObjectTypeStore } from './explosive-object-type';
import { SumExplosiveObjectActions } from './sum-explosive-object-actions';
import { type IViewerStore } from '../viewer';

interface IApi {
    explosiveObjectType: IExplosiveObjectTypeAPI;
    explosiveObjectClass: IExplosiveObjectClassAPI;
    explosiveObjectClassItem: IExplosiveObjectClassItemAPI;
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    viewer: IViewerStore;
}

export interface IExplosiveObjectStore {
    type: IExplosiveObjectTypeStore;
    class: IExplosiveObjectClassStore;
    classItem: IExplosiveObjectClassItemStore;
    collectionActions: CollectionModel<IExplosiveObjectAction, IExplosiveObjectActionData>;
    collectionDetails: CollectionModel<IExplosiveObjectDetails, IExplosiveObjectDetailsData>;
    collection: CollectionModel<IExplosiveObject, IExplosiveObjectData>;
    collectionCountries: CollectionModel<ICountry, ICountryData>;
    list: IListModel<IExplosiveObject, IExplosiveObjectData>;
    listCountries: IListModel<ICountry, ICountryData>;
    sum: SumExplosiveObjectActions;
    classifications: IClassifications;
    setSum: (sum: IExplosiveObjectActionSumDTO) => void;
    create: IRequestModel<[ICreateValue<IExplosiveObjectDataParams>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel<[search?: string]>;
    fetchSum: IRequestModel<[Dayjs, Dayjs]>;
    fetchMoreList: IRequestModel<[search?: string]>;
    fetchItem: IRequestModel<[string]>;
    fetchDeeps: IRequestModel;
}

export class ExplosiveObjectStore implements IExplosiveObjectStore {
    api: IApi;
    services: IServices;
    getStores: () => IStores;

    type: IExplosiveObjectTypeStore;
    class: IExplosiveObjectClassStore;
    classItem: IExplosiveObjectClassItemStore;

    collectionCountries = new CollectionModel<ICountry, ICountryData>({
        factory: (data: ICountryData) => new Country(data),
    });

    collectionActions = new CollectionModel<IExplosiveObjectAction, IExplosiveObjectActionData>({
        factory: (data: IExplosiveObjectActionData) => new ExplosiveObjectAction(data, this),
    });
    collectionDetails = new CollectionModel<IExplosiveObjectDetails, IExplosiveObjectDetailsData>({
        factory: (data: IExplosiveObjectDetailsData) => new ExplosiveObjectDetails(data),
    });
    collection = new CollectionModel<IExplosiveObject, IExplosiveObjectData>({
        factory: (data: IExplosiveObjectData) => new ExplosiveObject(data, this),
    });

    listCountries = new ListModel<ICountry, ICountryData>({
        collection: this.collectionCountries,
    });

    list = new ListModel<IExplosiveObject, IExplosiveObjectData>(this);
    sum = new SumExplosiveObjectActions();

    classifications: IClassifications;

    constructor(params: { api: IApi; services: IServices; getStores: () => IStores }) {
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

        this.classifications = new Classifications(this);
        this.type = new ExplosiveObjectTypeStore(this);
        this.class = new ExplosiveObjectClassStore(this);
        this.classItem = new ExplosiveObjectClassItemStore(this);
        this.classifications = new Classifications(this);

        makeAutoObservable(this);
    }

    get lists() {
        return {
            classItem: this.classItem?.list,
            class: this.class?.list,
        };
    }

    get collections() {
        return {
            details: this.collectionDetails,
            type: this.type?.collection,
            class: this.class?.collection,
            classItem: this.classItem?.collection,
            country: this.collectionCountries,
        };
    }

    setSum(sum: IExplosiveObjectActionSumDTO) {
        this.sum.set(createExplosiveObjectActionSum(sum));
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IExplosiveObjectDataParams>) => {
            const res = await this.api.explosiveObject.create(createExplosiveObjectDTO(data));

            const value = createExplosiveObject(res);

            if (res.details) {
                const details = createExplosiveObjectDetails(res.id, res.details);
                this.collectionDetails.set(details.id, details);
            }

            this.list.unshift(value);
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.explosiveObject.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.explosiveObject.getList({
                search,
                limit: this.list.pageSize,
            });

            this.collectionDetails.setArr(
                res
                    .map(el => (el?.details ? createExplosiveObjectDetails(el.id, el.details) : undefined))
                    .filter(Boolean) as IExplosiveObjectDetailsData[],
            );

            this.list.set(res.map(createExplosiveObject));
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.explosiveObject.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.collectionDetails.setArr(
                res
                    .map(el => (el?.details ? createExplosiveObjectDetails(el.id, el.details) : undefined))
                    .filter(Boolean) as IExplosiveObjectDetailsData[],
            );

            this.list.push(res.map(createExplosiveObject));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await this.api.explosiveObject.sum({
                where: {
                    executedAt: {
                        '>=': dates.toDateServer(startDate),
                        '<=': dates.toDateServer(endDate),
                    },
                },
            });

            this.setSum(res);
        },
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosiveObject.get(id);

            if (res.details) {
                const details = createExplosiveObjectDetails(res.id, res.details);
                this.collectionDetails.set(details.id, details);
            }

            this.collection.set(res.id, createExplosiveObject(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchDeeps = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            const [countries] = await Promise.all([
                this.api.explosiveObject.getCountriesList(),
                this.type.fetchList.run(),
                this.class.fetchList.run(),
                this.classItem.fetchList.run(),
            ]);

            this.listCountries.set(countries.map(createCountry));
            this.classifications.build();
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
