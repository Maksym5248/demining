import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectAPI, type IExplosiveObjectActionSumDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, type IListModel, type IRequestModel, type ISearchModel, ListModel, RequestModel, SearchModel } from '~/models';
import { type IMessage } from '~/services';

import { Classifications, type IClassifications } from './classifications';
import {
    ExplosiveObject,
    ExplosiveObjectType,
    createExplosiveObjectDTO,
    createExplosiveObjectActionSum,
    ExplosiveObjectAction,
    Country,
    ExplosiveObjectClass,
    ExplosiveObjectClassItem,
    createExplosiveObjectClassItem,
    createExplosiveObjectType,
    createExplosiveObjectClass,
    createCountry,
    ExplosiveObjectDetails,
    createExplosiveObject,
    createExplosiveObjectDetails,
    type IExplosiveObject,
    type IExplosiveObjectType,
    type IExplosiveObjectData,
    type IExplosiveObjectTypeData,
    type IExplosiveObjectDataParams,
    type IExplosiveObjectActionData,
    type IExplosiveObjectAction,
    type ICountry,
    type ICountryData,
    type IExplosiveObjectClassData,
    type IExplosiveObjectClass,
    type IExplosiveObjectClassItemData,
    type IExplosiveObjectClassItem,
    type IExplosiveObjectDetailsData,
    type IExplosiveObjectDetails,
} from './entities';
import { SumExplosiveObjectActions } from './sum-explosive-object-actions';
import { type IViewerStore } from '../viewer';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    viewer: IViewerStore;
}

export interface IExplosiveObjectStore {
    collectionTypes: CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    collectionActions: CollectionModel<IExplosiveObjectAction, IExplosiveObjectActionData>;
    collectionDetails: CollectionModel<IExplosiveObjectDetails, IExplosiveObjectDetailsData>;
    collection: CollectionModel<IExplosiveObject, IExplosiveObjectData>;
    collectionCountries: CollectionModel<ICountry, ICountryData>;
    collectionClasses: CollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    collectionClassesItems: CollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    listTypes: IListModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    listTypesSearch: ISearchModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    list: IListModel<IExplosiveObject, IExplosiveObjectData>;
    listCountries: IListModel<ICountry, ICountryData>;
    listClasses: IListModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    listClassesItems: IListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    sum: SumExplosiveObjectActions;
    classifications: IClassifications;
    sortedListTypes: IExplosiveObjectType[];
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
    stores: IStores;

    collectionTypes = new CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>({
        factory: (data: IExplosiveObjectTypeData) => new ExplosiveObjectType(data),
    });
    collectionCountries = new CollectionModel<ICountry, ICountryData>({
        factory: (data: ICountryData) => new Country(data),
    });
    collectionClasses = new CollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>({
        factory: (data: IExplosiveObjectClassData) =>
            new ExplosiveObjectClass(data, { collections: { classItem: this.collectionClassesItems }, lists: this.lists }),
    });
    collectionClassesItems = new CollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>({
        factory: (data: IExplosiveObjectClassItemData) => new ExplosiveObjectClassItem(data),
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
    listTypes = new ListModel<IExplosiveObjectType, IExplosiveObjectTypeData>({
        collection: this.collectionTypes,
    });
    listTypesSearch = new SearchModel<IExplosiveObjectType, IExplosiveObjectTypeData>(this.listTypes, { fields: ['displayName'] });
    listClasses = new ListModel<IExplosiveObjectClass, IExplosiveObjectClassData>({
        collection: this.collectionClasses,
    });
    listClassesItems = new ListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>({
        collection: this.collectionClassesItems,
    });
    list = new ListModel<IExplosiveObject, IExplosiveObjectData>(this);
    sum = new SumExplosiveObjectActions();

    classifications: IClassifications;

    constructor(params: { api: IApi; services: IServices; stores: IStores }) {
        this.api = params.api;
        this.services = params.services;
        this.stores = params.stores;

        this.classifications = new Classifications(this);

        makeAutoObservable(this);
    }

    get lists() {
        return {
            classItem: this.listClassesItems,
        };
    }

    get collections() {
        return {
            details: this.collectionDetails,
            type: this.collectionTypes,
            class: this.collectionClasses,
            classItem: this.collectionClassesItems,
            country: this.collectionCountries,
        };
    }

    get sortedListTypes() {
        return this.listTypes.asArray.sort((a, b) =>
            a.data.name.localeCompare(b.data.name, ['uk'], {
                numeric: true,
                sensitivity: 'base',
            }),
        );
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
        run: async () => {
            const [types, classes, classesItems, countries] = await Promise.all([
                this.api.explosiveObject.getTypesList(),
                this.api.explosiveObject.getClassesList(),
                this.api.explosiveObject.getClassesItemsList(),
                this.api.explosiveObject.getCountriesList(),
            ]);

            this.listTypes.set(types.map(createExplosiveObjectType));
            this.listClasses.set(classes.map(createExplosiveObjectClass));
            this.listClassesItems.set(classesItems.map(createExplosiveObjectClassItem));
            this.listCountries.set(countries.map(createCountry));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
