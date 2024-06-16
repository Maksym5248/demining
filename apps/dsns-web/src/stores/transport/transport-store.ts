import {
    type CreateValue,
    CollectionModel,
    type ICollectionModel,
    type IListModel,
    type IRequestModel,
    ListModel,
    RequestModel,
} from '@/shared-client';
import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { Api, type ITransportDTO } from '~/api';
import { TRANSPORT_TYPE } from '~/constants';
import { dates } from '~/utils';

import {
    type ITransport,
    type ITransportAction,
    type ITransportActionValue,
    type ITransportValue,
    Transport,
    TransportAction,
    createTransport,
    createTransportDTO,
} from './entities';

export interface ITransportStore {
    collectionActions: ICollectionModel<ITransportAction, ITransportActionValue>;
    collection: ICollectionModel<ITransport, ITransportValue>;
    list: IListModel<ITransport, ITransportValue>;
    searchList: IListModel<ITransport, ITransportValue>;
    append(res: ITransportDTO[], isSearch: boolean, isMore?: boolean): void;
    transportExplosiveObjectList: ITransport[];
    transportHumansList: ITransport[];
    transportExplosiveObjectFirst: ITransport;
    transportHumansFirst: ITransport;
    getList(search: string): IListModel<ITransport, ITransportValue>;
    create: IRequestModel<[CreateValue<ITransportValue>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel<[search: string]>;
    fetchMoreList: IRequestModel<[search: string]>;
    fetchItem: IRequestModel<[string]>;
}
export class TransportStore implements ITransportStore {
    collectionActions = new CollectionModel<ITransportAction, ITransportActionValue>({
        factory: (data: ITransportActionValue) => new TransportAction(data),
    });

    collection = new CollectionModel<ITransport, ITransportValue>({
        factory: (data: ITransportValue) => new Transport(data),
    });

    list = new ListModel<ITransport, ITransportValue>({ collection: this.collection });
    searchList = new ListModel<ITransport, ITransportValue>({ collection: this.collection });

    constructor() {
        makeAutoObservable(this);
    }

    append(res: ITransportDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createTransport), true);
    }

    get transportExplosiveObjectList() {
        return this.list.asArray.filter((el) => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS);
    }
    get transportHumansList() {
        return this.list.asArray.filter((el) => el.type === TRANSPORT_TYPE.FOR_HUMANS);
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
        run: async (data: CreateValue<ITransportValue>) => {
            const res = await Api.transport.create(createTransportDTO(data));
            const value = createTransport(res);

            this.list.unshift(value);
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await Api.transport.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => message.success('Видалено успішно'),
        onError: () => message.error('Не вдалось видалити'),
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

            const res = await Api.transport.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onError: () => message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        shouldRun: (search: string) => {
            const list = this.getList(search);

            return list.isMorePages;
        },
        run: async (search: string) => {
            const isSearch = !!search;
            const list = this.getList(search);

            const res = await Api.transport.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onError: () => message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await Api.transport.get(id);

            this.collection.set(res.id, createTransport(res));
        },
        onError: () => message.error('Виникла помилка'),
    });
}
