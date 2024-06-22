import { makeAutoObservable } from 'mobx';
import { TRANSPORT_TYPE } from 'shared-my/db';

import { type ITransportAPI, type ITransportDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, type ICollectionModel, type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type ITransport,
    type ITransportAction,
    type ITransportActionData,
    type ITransportData,
    Transport,
    TransportAction,
    createTransport,
    createTransportDTO,
} from './entities';

interface IApi {
    transport: ITransportAPI;
}

interface IServices {
    message: IMessage;
}

export interface ITransportStore {
    collectionActions: ICollectionModel<ITransportAction, ITransportActionData>;
    collection: ICollectionModel<ITransport, ITransportData>;
    list: IListModel<ITransport, ITransportData>;
    searchList: IListModel<ITransport, ITransportData>;
    append(res: ITransportDTO[], isSearch: boolean, isMore?: boolean): void;
    transportExplosiveObjectList: ITransport[];
    transportHumansList: ITransport[];
    transportExplosiveObjectFirst: ITransport;
    transportHumansFirst: ITransport;
    getList(search: string): IListModel<ITransport, ITransportData>;
    create: IRequestModel<[ICreateValue<ITransportData>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel<[search: string]>;
    fetchMoreList: IRequestModel<[search: string]>;
    fetchItem: IRequestModel<[string]>;
}
export class TransportStore implements ITransportStore {
    api: IApi;
    services: IServices;

    collectionActions = new CollectionModel<ITransportAction, ITransportActionData>({
        factory: (data: ITransportActionData) => new TransportAction(data, this),
    });

    collection = new CollectionModel<ITransport, ITransportData>({
        factory: (data: ITransportData) => new Transport(data, this),
    });

    list = new ListModel<ITransport, ITransportData>({ collection: this.collection });
    searchList = new ListModel<ITransport, ITransportData>({ collection: this.collection });

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    append(res: ITransportDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createTransport), true);
    }

    get transportExplosiveObjectList() {
        return this.list.asArray.filter((el) => el.data.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS);
    }
    get transportHumansList() {
        return this.list.asArray.filter((el) => el.data.type === TRANSPORT_TYPE.FOR_HUMANS);
    }

    get transportExplosiveObjectFirst() {
        return this.transportExplosiveObjectList[0];
    }
    get transportHumansFirst() {
        return this.transportHumansList[0];
    }

    getList(search: string) {
        return search ? this.searchList : this.list;
    }

    create = new RequestModel({
        run: async (data: ICreateValue<ITransportData>) => {
            const res = await this.api.transport.create(createTransportDTO(data));
            const value = createTransport(res);

            this.list.unshift(value);
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.transport.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        shouldRun: (search: string) => {
            const isSearch = !!search;
            const list = this.getList(search);

            return !(!isSearch && list.asArray.length);
        },
        run: async (search: string) => {
            const isSearch = !!search;
            const list = this.getList(search);

            const res = await this.api.transport.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        shouldRun: (search: string) => {
            const list = this.getList(search);

            return list.isMorePages;
        },
        run: async (search: string) => {
            const isSearch = !!search;
            const list = this.getList(search);

            const res = await this.api.transport.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.data.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.transport.get(id);

            this.collection.set(res.id, createTransport(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
