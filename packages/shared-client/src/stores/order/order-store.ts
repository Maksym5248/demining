import { makeAutoObservable } from 'mobx';

import { type IOrderAPI, type IOrderPreviewDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, type ICollectionModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IOrder, type IOrderData, type IOrderDataParams, Order, createOrder, createOrderDTO, createOrderPreview } from './entities';
import { type IEmployeeStore, createEmployeeAction } from '../employee';

export interface IOrderStore {
    collection: ICollectionModel<IOrder, IOrderData>;
    list: ListModel<IOrder, IOrderData>;
    searchList: ListModel<IOrder, IOrderData>;
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
    stores: IStores;
    api: Pick<IApi, 'order'>;
    services: IServices;
}

export class OrderStore implements IOrderStore {
    stores: IStores;
    api: IApi;
    services: IServices;

    constructor({ stores, api, services }: IOrderStoreParams) {
        this.stores = stores;
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get collections() {
        return {
            employeeAction: this.stores.employee.collectionActions,
        };
    }

    collection = new CollectionModel<IOrder, IOrderData>({
        factory: (data: IOrderData) => new Order(data, this),
    });

    list = new ListModel<IOrder, IOrderData>({
        collection: this.collection,
    });

    searchList = new ListModel<IOrder, IOrderData>({
        collection: this.collection,
    });

    append(res: IOrderPreviewDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createOrderPreview), true);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IOrderDataParams>) => {
            const res = await this.api.order.create(createOrderDTO(data));

            this.stores.employee.collectionActions.set(res.signedByAction?.id, createEmployeeAction(res.signedByAction));
            this.list.unshift(createOrder(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.order.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.order.get(id);
            this.stores.employee.collectionActions.set(res.signedByAction?.id, createEmployeeAction(res.signedByAction));
            this.collection.set(res.id, createOrder(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchList = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return !(!isSearch && list.length);
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await this.api.order.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return list.isMorePages;
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await this.api.order.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.data.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
