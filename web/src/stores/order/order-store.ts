import { message } from 'antd';

import { Api, IOrderPreviewDTO } from '~/api';
import { CreateValue } from '~/types';
import { dates } from '~/utils';
import { CollectionModel, ICollectionModel, ListModel, RequestModel } from '~/utils/models';

import { IOrder, IOrderValue, IOrderValueParams, Order, createOrder, createOrderDTO, createOrderPreview } from './entities';
import { IEmployeeStore, createEmployeeAction } from '../employee';

export interface IOrderStore {
    collection: ICollectionModel<IOrder, IOrderValue>;
    list: ListModel<IOrder, IOrderValue>;
    searchList: ListModel<IOrder, IOrderValue>;
    create: RequestModel<[CreateValue<IOrderValueParams>]>;
    remove: RequestModel<[string]>;
    fetchItem: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
}

interface IStores {
    employee: IEmployeeStore;
}

interface IOrderStoreParams {
    stores: IStores;
}

export class OrderStore implements IOrderStore {
    stores: IStores;

    constructor({ stores }: IOrderStoreParams) {
        this.stores = stores;
    }

    private getCollections = () => ({
        employeeAction: this.stores.employee.collectionActions,
    });

    collection = new CollectionModel<IOrder, IOrderValue>({
        factory: (data: IOrderValue) => new Order(data, { collections: this.getCollections() }),
    });

    list = new ListModel<IOrder, IOrderValue>({
        collection: this.collection,
    });

    searchList = new ListModel<IOrder, IOrderValue>({
        collection: this.collection,
    });

    append(res: IOrderPreviewDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createOrderPreview), true);
    }

    create = new RequestModel({
        run: async (data: CreateValue<IOrderValueParams>) => {
            const res = await Api.order.create(createOrderDTO(data));

            this.stores.employee.collectionActions.set(res.signedByAction?.id, createEmployeeAction(res.signedByAction));
            this.list.unshift(createOrder(res));
        },
        onSuccuss: message.error('Додано успішно'),
        onError: message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await Api.order.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: message.error('Видалено успішно'),
        onError: message.error('Не вдалось видалити'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await Api.order.get(id);
            this.stores.employee.collectionActions.set(res.signedByAction?.id, createEmployeeAction(res.signedByAction));
            this.collection.set(res.id, createOrder(res));
        },
        onError: message.error('Виникла помилка'),
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

            const res = await Api.order.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onError: message.error('Виникла помилка'),
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

            const res = await Api.order.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onError: message.error('Виникла помилка'),
    });
}
