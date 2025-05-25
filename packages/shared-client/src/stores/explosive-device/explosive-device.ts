import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_DEVICE_TYPE } from 'shared-my';

import { type IExplosiveDeviceAPI, type IExplosiveActionSumDTO, type IExplosiveDeviceDTO, type IExplosiveDeviceTypeDTO } from '~/api';
import { data, type ISubscriptionDocument, type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, type ICollectionModel, type IListModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IExplosiveDevice,
    type IExplosiveDeviceData,
    type IExplosiveDeviceActionData,
    type IExplosiveDeviceAction,
    createExplosiveDevice,
    createExplosiveDeviceDTO,
    ExplosiveDevice,
    ExplosiveDeviceAction,
    createExplosiveDeviceActionSum,
    type IExplosiveDeviceType,
    type IExplosiveDeviceTypeData,
    ExplosiveDeviceType,
    createExplosiveDeviceType,
} from './entities';
import { SumExplosiveDeviceActions } from './sum-explosive-actions';
import { getDictionarySync } from '../filter';
import { type IViewerStore } from '../viewer';

export interface IExplosiveDeviceStore {
    collectionActions: ICollectionModel<IExplosiveDeviceAction, IExplosiveDeviceActionData>;
    collection: ICollectionModel<IExplosiveDevice, IExplosiveDeviceData>;
    collectionType: ICollectionModel<IExplosiveDeviceType, IExplosiveDeviceTypeData>;
    list: IListModel<IExplosiveDevice, IExplosiveDeviceData>;
    sum: SumExplosiveDeviceActions;
    setSum(sum: IExplosiveActionSumDTO): void;
    explosiveItems: IExplosiveDevice[];
    detonatorItems: IExplosiveDevice[];
    create: RequestModel<[ICreateValue<IExplosiveDeviceData>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
    sync: RequestModel;
    syncType: RequestModel;
}

interface IApi {
    explosiveDevice: IExplosiveDeviceAPI;
}

interface IStores {
    viewer?: IViewerStore;
}

interface IServices {
    message: IMessage;
}

export class ExplosiveDeviceStore implements IExplosiveDeviceStore {
    api: IApi;
    services: IServices;
    getStores: () => IStores;

    collectionActions: ICollectionModel<IExplosiveDeviceAction, IExplosiveDeviceActionData> = new CollectionModel<
        IExplosiveDeviceAction,
        IExplosiveDeviceActionData
    >({
        factory: (data: IExplosiveDeviceActionData) => new ExplosiveDeviceAction(data, this),
    });

    collectionType: ICollectionModel<IExplosiveDeviceType, IExplosiveDeviceTypeData> = new CollectionModel<
        IExplosiveDeviceType,
        IExplosiveDeviceTypeData
    >({
        factory: (data: IExplosiveDeviceTypeData) => new ExplosiveDeviceType(data),
    });

    collection: ICollectionModel<IExplosiveDevice, IExplosiveDeviceData> = new CollectionModel<IExplosiveDevice, IExplosiveDeviceData>({
        factory: (data: IExplosiveDeviceData) => new ExplosiveDevice(data, this),
    });
    list = new ListModel<IExplosiveDevice, IExplosiveDeviceData>({ collection: this.collection });
    sum: SumExplosiveDeviceActions = new SumExplosiveDeviceActions();

    constructor(params: { api: IApi; services: IServices; getStores: () => IStores }) {
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    get collections() {
        return {
            type: this.collectionType,
        };
    }

    setSum(sum: IExplosiveActionSumDTO) {
        this.sum = createExplosiveDeviceActionSum(sum);
    }

    get explosiveItems() {
        return this.list.asArray.filter(el => el.data.type === EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE);
    }

    get detonatorItems() {
        return this.list.asArray.filter(el => el.data.type === EXPLOSIVE_DEVICE_TYPE.DETONATOR);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IExplosiveDeviceData>) => {
            const res = await this.api.explosiveDevice.create(createExplosiveDeviceDTO(data));

            this.list.unshift(createExplosiveDevice(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.explosiveDevice.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.explosiveDevice.getList({
                search,
                ...getDictionarySync(this),
                limit: this.list.pageSize,
            });

            this.list.set(res.map(createExplosiveDevice));
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.explosiveDevice.getList({
                search,
                ...getDictionarySync(this),
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createExplosiveDevice));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosiveDevice.get(id);

            this.collection.set(res.id, createExplosiveDevice(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await this.api.explosiveDevice.sum({
                where: {
                    executedAt: {
                        '>=': dates.toDateServer(startDate),
                        '<=': dates.toDateServer(endDate),
                    },
                },
            });

            this.setSum(res);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    sync = new RequestModel({
        run: async () => {
            await this.api.explosiveDevice.sync(getDictionarySync(this), (values: ISubscriptionDocument<IExplosiveDeviceDTO>[]) => {
                const { create, update, remove } = data.sortByType<IExplosiveDeviceDTO, IExplosiveDeviceData>(
                    values,
                    createExplosiveDevice,
                );

                this.list.push(create);
                this.collection.update(update);
                this.collection.remove(remove);
            });
        },
    });

    syncType = new RequestModel({
        run: async () => {
            await this.api.explosiveDevice.syncType({}, (values: ISubscriptionDocument<IExplosiveDeviceTypeDTO>[]) => {
                const { create, update, remove } = data.sortByType<IExplosiveDeviceTypeDTO, IExplosiveDeviceTypeData>(
                    values,
                    createExplosiveDeviceType,
                );

                this.collectionType.set(create);
                this.collectionType.update(update);
                this.collectionType.remove(remove);
            });
        },
    });
}
