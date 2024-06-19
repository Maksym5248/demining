import { EQUIPMENT_TYPE } from '@/shared/db';
import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { type IEquipmentAPI, type IEquipmentDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';

import {
    type IEquipment,
    type IEquipmentValue,
    Equipment,
    createEquipment,
    createEquipmentDTO,
    EquipmentAction,
    type IEquipmentActionValue,
    type IEquipmentAction,
} from './entities';

export interface IEquipmentStore {
    collectionActions: CollectionModel<IEquipmentAction, IEquipmentActionValue>;
    collection: CollectionModel<IEquipment, IEquipmentValue>;
    list: ListModel<IEquipment, IEquipmentValue>;
    searchList: ListModel<IEquipment, IEquipmentValue>;
    listMineDetectors: IEquipment[];
    firstMineDetector: IEquipment | undefined;
    append(res: IEquipmentDTO[], isSearch: boolean, isMore?: boolean): void;
    create: RequestModel<[ICreateValue<IEquipmentValue>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
}

interface IApi {
    equipment: IEquipmentAPI;
}

export class EquipmentStore implements IEquipmentStore {
    api: IApi;

    collectionActions = new CollectionModel<IEquipmentAction, IEquipmentActionValue>({
        factory: (data: IEquipmentActionValue) => new EquipmentAction(data, this),
    });
    collection = new CollectionModel<IEquipment, IEquipmentValue>({
        factory: (data: IEquipmentValue) => new Equipment(data, this),
    });
    list = new ListModel<IEquipment, IEquipmentValue>({ collection: this.collection });
    searchList = new ListModel<IEquipment, IEquipmentValue>({ collection: this.collection });

    constructor(params: { api: IApi }) {
        makeAutoObservable(this);
        this.api = params.api;
    }

    get listMineDetectors() {
        return this.list.asArray.filter((el) => el.type === EQUIPMENT_TYPE.MINE_DETECTOR);
    }

    get firstMineDetector() {
        return this.listMineDetectors[0];
    }

    append(res: IEquipmentDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createEquipment));
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IEquipmentValue>) => {
            const res = await this.api.equipment.create(createEquipmentDTO(data));
            this.list.unshift(createEquipment(res));
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.equipment.remove(id);

            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => message.success('Видалено успішно'),
        onError: () => message.error('Не вдалось видалити'),
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

            const res = await this.api.equipment.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onError: () => message.error('Виникла помилка'),
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

            const res = await this.api.equipment.getList({
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
            const res = await this.api.equipment.get(id);

            this.collection.set(res.id, createEquipment(res));
        },
        onError: () => message.error('Виникла помилка'),
    });
}
