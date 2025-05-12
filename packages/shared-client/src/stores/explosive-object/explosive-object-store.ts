import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_OBJECT_COMPONENT, APPROVE_STATUS } from 'shared-my';

import {
    type IExplosiveObjectTypeAPI,
    type IExplosiveObjectAPI,
    type IExplosiveObjectActionSumDTO,
    type IExplosiveObjectClassAPI,
    type IExplosiveObjectClassItemAPI,
    type IExplosiveObjectDTO,
    type IExplosiveObjectDetailsDTO,
    type IExplosiveObjectComponentDTO,
} from '~/api';
import { type ISubscriptionDocument, type ICreateValue, type IQuery } from '~/common';
import { dates } from '~/common';
import { CollectionModel, type ICollectionModel, type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type ICrashlytics, type IMessage } from '~/services';

import { Classifications, type IClassifications } from './classifications';
import {
    ExplosiveObject,
    createExplosiveObjectDTO,
    createExplosiveObjectActionSum,
    ExplosiveObjectAction,
    ExplosiveObjectDetails,
    createExplosiveObject,
    createExplosiveObjectDetails,
    type IExplosiveObject,
    type IExplosiveObjectData,
    type IExplosiveObjectDataParams,
    type IExplosiveObjectActionData,
    type IExplosiveObjectAction,
    type IExplosiveObjectDetailsData,
    type IExplosiveObjectDetails,
    type IExplosiveObjectComponent,
    type IExplosiveObjectComponentData,
    ExplosiveObjectComponent,
    createExplosiveObjectComponent,
} from './entities';
import { ExplosiveObjectClassStore, type IExplosiveObjectClassStore } from './explosive-object-class';
import { ExplosiveObjectClassItemStore, type IExplosiveObjectClassItemStore } from './explosive-object-class-item';
import { ExplosiveObjectTypeStore, type IExplosiveObjectTypeStore } from './explosive-object-type';
import { SumExplosiveObjectActions } from './sum-explosive-object-actions';
import { type ICommonStore } from '../common';
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
    crashlytics: ICrashlytics;
}

interface IStores {
    viewer?: IViewerStore;
    explosive: IExplosiveStore;
    common: ICommonStore;
}

export interface IExplosiveObjectStore {
    type: IExplosiveObjectTypeStore;
    class: IExplosiveObjectClassStore;
    classItem: IExplosiveObjectClassItemStore;
    collectionComponents: ICollectionModel<IExplosiveObjectComponent, IExplosiveObjectComponentData>;
    collectionActions: ICollectionModel<IExplosiveObjectAction, IExplosiveObjectActionData>;
    collectionDetails: ICollectionModel<IExplosiveObjectDetails, IExplosiveObjectDetailsData>;
    collection: ICollectionModel<IExplosiveObject, IExplosiveObjectData>;
    list: IListModel<IExplosiveObject, IExplosiveObjectData>;
    listFuse: IListModel<IExplosiveObject, IExplosiveObjectData>;
    listFevor: IListModel<IExplosiveObject, IExplosiveObjectData>;
    sum: SumExplosiveObjectActions;
    classifications: IClassifications;
    setSum: (sum: IExplosiveObjectActionSumDTO) => void;
    create: IRequestModel<[ICreateValue<IExplosiveObjectDataParams>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel<[search?: string]>;
    fetchListFuse: IRequestModel<[search?: string]>;
    fetchListFevor: IRequestModel<[search?: string]>;
    fetchSum: IRequestModel<[Dayjs, Dayjs]>;
    fetchMoreList: IRequestModel<[search?: string]>;
    fetchMoreListFuse: IRequestModel<[search?: string]>;
    fetchMoreListFevor: IRequestModel<[search?: string]>;
    fetchItem: IRequestModel<[string]>;
    fetchDeeps: IRequestModel;
    sync: IRequestModel<[query?: Partial<IQuery> | null]>;
    syncDetails: IRequestModel;
    syncDeeps: IRequestModel;
}

export class ExplosiveObjectStore implements IExplosiveObjectStore {
    api: IApi;
    services: IServices;
    getStores: () => IStores;

    type: IExplosiveObjectTypeStore;
    class: IExplosiveObjectClassStore;
    classItem: IExplosiveObjectClassItemStore;

    collectionComponents: ICollectionModel<IExplosiveObjectComponent, IExplosiveObjectComponentData> = new CollectionModel<
        IExplosiveObjectComponent,
        IExplosiveObjectComponentData
    >({
        factory: (data: IExplosiveObjectComponentData) => new ExplosiveObjectComponent(data),
    });
    collectionActions: ICollectionModel<IExplosiveObjectAction, IExplosiveObjectActionData> = new CollectionModel<
        IExplosiveObjectAction,
        IExplosiveObjectActionData
    >({
        factory: (data: IExplosiveObjectActionData) => new ExplosiveObjectAction(data, this),
    });
    collectionDetails: ICollectionModel<IExplosiveObjectDetails, IExplosiveObjectDetailsData> = new CollectionModel<
        IExplosiveObjectDetails,
        IExplosiveObjectDetailsData
    >({
        factory: (data: IExplosiveObjectDetailsData) => new ExplosiveObjectDetails(data, this),
    });
    collection: ICollectionModel<IExplosiveObject, IExplosiveObjectData> = new CollectionModel<IExplosiveObject, IExplosiveObjectData>({
        factory: (data: IExplosiveObjectData) => new ExplosiveObject(data, this),
    });

    list = new ListModel<IExplosiveObject, IExplosiveObjectData>(this);
    listFuse = new ListModel<IExplosiveObject, IExplosiveObjectData>(this);
    listFevor = new ListModel<IExplosiveObject, IExplosiveObjectData>(this);

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
            country: this.getStores().common.collections.countries,
            component: this.collectionComponents,
            material: this.getStores().common.collections.materials,
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

            if (res.fuse?.length) {
                this.collection.set(res.fuse.map(createExplosiveObject));
            }

            if (res.fervor?.length) {
                this.collection.set(res.fervor.map(createExplosiveObject));
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

            this.list.push(res.map(createExplosiveObject));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchListFuse = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.explosiveObject.getList({
                search,
                limit: this.listFuse.pageSize,
                ...getDictionaryFilter(this, EXPLOSIVE_OBJECT_COMPONENT.FUSE),
            });

            this.listFuse.set(res.map(createExplosiveObject));
        },
    });

    fetchMoreListFuse = new RequestModel({
        shouldRun: () => this.listFuse.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.explosiveObject.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.listFuse.last.data.createdAt),
                ...getDictionaryFilter(this, EXPLOSIVE_OBJECT_COMPONENT.FUSE),
            });

            this.listFuse.push(res.map(createExplosiveObject));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchListFevor = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.explosiveObject.getList({
                search,
                limit: this.listFevor.pageSize,
                ...getDictionaryFilter(this, EXPLOSIVE_OBJECT_COMPONENT.FERVOR),
            });

            this.listFevor.set(res.map(createExplosiveObject));
        },
    });

    fetchMoreListFevor = new RequestModel({
        shouldRun: () => this.listFevor.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.explosiveObject.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.listFevor.last.data.createdAt),
                ...getDictionaryFilter(this, EXPLOSIVE_OBJECT_COMPONENT.FERVOR),
            });

            this.listFevor.push(res.map(createExplosiveObject));
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
                this.getStores().explosive.collection.set(res.explosive.map(createExplosive));
            }

            if (res.fuse?.length) {
                this.collection.set(res.fuse.map(createExplosiveObject));
            }

            if (res.fervor?.length) {
                this.collection.set(res.fervor.map(createExplosiveObject));
            }
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchDeeps = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            await Promise.all([this.type.fetchList.run(), this.class.fetchList.run(), this.classItem.fetchList.run()]);

            this.classifications.init();
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    sync = new RequestModel({
        run: async () => {
            await this.api.explosiveObject.sync(
                {
                    where: {
                        status: APPROVE_STATUS.CONFIRMED,
                    },
                },
                (values: ISubscriptionDocument<IExplosiveObjectDTO>[]) => {
                    const create: IExplosiveObjectData[] = [];
                    const update: IExplosiveObjectData[] = [];
                    const remove: string[] = [];

                    values.forEach(value => {
                        if (value.type === 'removed') {
                            remove.push(value.data.id);
                        } else if (value.type === 'added') {
                            create.push(createExplosiveObject(value.data));
                        } else if (value.type === 'modified') {
                            update.push(createExplosiveObject(value.data));
                        }
                    });

                    this.list.push(create);
                    this.collection.update(update);
                    this.collection.remove(remove);
                },
            );
        },
        onError: e => this.services.crashlytics.error('sync', e),
    });

    syncDetails = new RequestModel({
        run: async () => {
            await this.api.explosiveObject.syncDetails(
                {
                    where: {
                        status: APPROVE_STATUS.CONFIRMED,
                    },
                },
                (values: ISubscriptionDocument<IExplosiveObjectDetailsDTO>[]) => {
                    const create: IExplosiveObjectDetailsData[] = [];
                    const update: IExplosiveObjectDetailsData[] = [];
                    const remove: string[] = [];

                    values.forEach(value => {
                        if (value.type === 'removed') {
                            remove.push(value.data.id);
                        } else if (value.type === 'added') {
                            create.push(createExplosiveObjectDetails(value.data.id, value.data));
                        } else if (value.type === 'modified') {
                            update.push(createExplosiveObjectDetails(value.data.id, value.data));
                        }
                    });

                    this.collectionDetails.set(create);
                    this.collectionDetails.update(update);
                    this.collectionDetails.remove(remove);
                },
            );
        },
        onError: e => this.services.crashlytics.error('syncDetails', e),
    });

    syncComponents = new RequestModel({
        run: async () => {
            await this.api.explosiveObject.syncComponents({}, (values: ISubscriptionDocument<IExplosiveObjectComponentDTO>[]) => {
                const create: IExplosiveObjectComponentData[] = [];
                const update: IExplosiveObjectComponentData[] = [];
                const remove: string[] = [];

                values.forEach(value => {
                    if (value.type === 'removed') {
                        remove.push(value.data.id);
                    } else if (value.type === 'added') {
                        create.push(createExplosiveObjectComponent(value.data));
                    } else if (value.type === 'modified') {
                        update.push(createExplosiveObjectComponent(value.data));
                    }
                });

                this.collectionComponents.set(create);
                this.collectionComponents.update(update);
                this.collectionComponents.remove(remove);
            });
        },
        onError: e => this.services.crashlytics.error('syncComponents', e),
    });

    syncDeeps = new RequestModel({
        run: async () => {
            await Promise.all([this.syncComponents.run(), this.type.sync.run(), this.class.sync.run(), this.classItem.sync.run()]);

            this.classifications.init();
        },
        onError: e => this.services.crashlytics.error('syncDeeps', e),
    });
}
