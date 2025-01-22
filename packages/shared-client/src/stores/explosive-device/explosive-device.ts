import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_DEVICE_TYPE } from 'shared-my';

import { type IExplosiveDeviceAPI, type IExplosiveActionSumDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';
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
} from './entities';
import { SumExplosiveDeviceActions } from './sum-explosive-actions';
import { type IViewerStore } from '../viewer';

export interface IExplosiveDeviceStore {
    collectionActions: CollectionModel<IExplosiveDeviceAction, IExplosiveDeviceActionData>;
    collection: CollectionModel<IExplosiveDevice, IExplosiveDeviceData>;
    list: ListModel<IExplosiveDevice, IExplosiveDeviceData>;
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

    collectionActions = new CollectionModel<IExplosiveDeviceAction, IExplosiveDeviceActionData>({
        factory: (data: IExplosiveDeviceActionData) => new ExplosiveDeviceAction(data, this),
    });
    collection = new CollectionModel<IExplosiveDevice, IExplosiveDeviceData>({
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
}
