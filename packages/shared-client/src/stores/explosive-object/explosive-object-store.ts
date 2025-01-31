import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_OBJECT_STATUS } from 'shared-my';

import {
    type IExplosiveObjectTypeAPI,
    type IExplosiveObjectAPI,
    type IExplosiveObjectActionSumDTO,
    type IExplosiveObjectClassAPI,
    type IExplosiveObjectClassItemAPI,
    type IExplosiveObjectDTO,
} from '~/api';
import { type ISubscriptionDocument, type ICreateValue, type IQuery } from '~/common';
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
import { createExplosive, type IExplosiveStore } from '../explosive';
import { getDictionaryFilter } from '../filter';
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
    viewer?: IViewerStore;
    explosive: IExplosiveStore;
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
    listFuse: IListModel<IExplosiveObject, IExplosiveObjectData>;
    listCountries: IListModel<ICountry, ICountryData>;
    sum: SumExplosiveObjectActions;
    classifications: IClassifications;
    setSum: (sum: IExplosiveObjectActionSumDTO) => void;
    create: IRequestModel<[ICreateValue<IExplosiveObjectDataParams>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel<[search?: string]>;
    fetchListFuse: IRequestModel<[search?: string]>;
    fetchSum: IRequestModel<[Dayjs, Dayjs]>;
    fetchMoreList: IRequestModel<[search?: string]>;
    fetchMoreListFuse: IRequestModel<[search?: string]>;
    fetchItem: IRequestModel<[string]>;
    fetchDeeps: IRequestModel;
    subscribe: IRequestModel<[query?: Partial<IQuery> | null]>;
    subscribeDeeps: IRequestModel;
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
    listFuse = new ListModel<IExplosiveObject, IExplosiveObjectData>(this);

    sum = new SumExplosiveObjectActions();

    classifications: IClassifications;

    constructor(params: { api: IApi; services: IServices; getStores: () => IStores }) {
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

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
                ...getDictionaryFilter(this),
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
                ...getDictionaryFilter(this),
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

    fetchListFuse = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.explosiveObject.getList({
                search,
                limit: this.list.pageSize,
                ...getDictionaryFilter(this),
            });

            this.collectionDetails.setArr(
                res
                    .map(el => (el?.details ? createExplosiveObjectDetails(el.id, el.details) : undefined))
                    .filter(Boolean) as IExplosiveObjectDetailsData[],
            );

            this.listFuse.set(res.map(createExplosiveObject));
        },
    });

    fetchMoreListFuse = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.explosiveObject.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.listFuse.last.data.createdAt),
                ...getDictionaryFilter(this),
            });

            this.collectionDetails.setArr(
                res
                    .map(el => (el?.details ? createExplosiveObjectDetails(el.id, el.details) : undefined))
                    .filter(Boolean) as IExplosiveObjectDetailsData[],
            );

            this.listFuse.push(res.map(createExplosiveObject));
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

            if (res.explosive) {
                this.getStores().explosive.collection.setArr(res.explosive.map(createExplosive));
            }
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
            this.classifications.init();
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    subscribeCountries = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            const countries = await this.api.explosiveObject.getCountriesList();

            this.listCountries.set(countries.map(createCountry));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    subscribe = new RequestModel({
        run: async () => {
            await this.api.explosiveObject.subscribe(
                {
                    where: {
                        status: EXPLOSIVE_OBJECT_STATUS.CONFIRMED,
                    },
                },
                (values: ISubscriptionDocument<IExplosiveObjectDTO>[]) => {
                    const create: IExplosiveObjectData[] = [];
                    const createDetails: IExplosiveObjectDetailsData[] = [];
                    const update: IExplosiveObjectData[] = [];
                    const updateDetails: IExplosiveObjectDetailsData[] = [];
                    const remove: string[] = [];

                    values.forEach(value => {
                        if (value.type === 'removed') {
                            remove.push(value.data.id);
                        } else if (value.type === 'added') {
                            create.push(createExplosiveObject(value.data));
                            !!value.data.details && createDetails.push(createExplosiveObjectDetails(value.data.id, value.data.details));
                        } else if (value.type === 'modified') {
                            update.push(createExplosiveObject(value.data));
                            !!value.data.details && updateDetails.push(createExplosiveObjectDetails(value.data.id, value.data.details));
                        }
                    });

                    this.list.push(create);
                    this.collectionDetails.setArr(createDetails);
                    this.collection.updateArr(update);
                    this.collectionDetails.updateArr(updateDetails);
                    this.collection.remove(remove);
                },
            );
        },
    });

    subscribeDeeps = new RequestModel({
        run: async () => {
            const [countries] = await Promise.all([
                this.api.explosiveObject.getCountriesList(),
                this.type.subscribe.run(),
                this.class.subscribe.run(),
                this.classItem.subscribe.run(),
            ]);

            this.listCountries.set(countries.map(createCountry));
            this.classifications.init();
        },
    });
}
