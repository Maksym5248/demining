import { makeAutoObservable } from 'mobx';

import { type IOrderAPI } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, type ICollectionModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IOrder, type IOrderData, type IOrderDataParams, Order, createOrder, createOrderDTO, createOrderPreview } from './entities';
import { type IEmployeeStore, createEmployeeAction } from '../employee';

export interface IOrderStore {
    collection: ICollectionModel<IOrder, IOrderData>;
    list: ListModel<IOrder, IOrderData>;
    create: RequestModel<[ICreateValue<IOrderDataParams>]>;
    remove: RequestModel<[string]>;
    fetchItem: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    employee: IEmployeeStore;
}

interface IApi {
    order: IOrderAPI;
}

interface IOrderStoreParams {
    getStores: () => IStores;
    api: Pick<IApi, 'order'>;
    services: IServices;
}

export class OrderStore implements IOrderStore {
    getStores: () => IStores;
    api: IApi;
    services: IServices;

    constructor({ getStores, api, services }: IOrderStoreParams) {
        this.getStores = getStores;
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get collections() {
        return {
            employeeAction: this.getStores().employee.collectionActions,
        };
    }

    collection = new CollectionModel<IOrder, IOrderData>({
        factory: (data: IOrderData) => new Order(data, this),
    });

    list = new ListModel<IOrder, IOrderData>({
        collection: this.collection,
    });

    create = new RequestModel({
        run: async (data: ICreateValue<IOrderDataParams>) => {
            const res = await this.api.order.create(createOrderDTO(data));

            this.getStores().employee.collectionActions.set(res.signedByAction?.id, createEmployeeAction(res.signedByAction));
            this.list.unshift(createOrder(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.order.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.order.get(id);
            this.getStores().employee.collectionActions.set(res.signedByAction?.id, createEmployeeAction(res.signedByAction));
            this.collection.set(res.id, createOrder(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.order.getList({
                search,
                limit: this.list.pageSize,
            });

            this.list.set(res.map(createOrderPreview));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.order.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createOrderPreview));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
