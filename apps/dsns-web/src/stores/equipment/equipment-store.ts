import { EQUIPMENT_TYPE } from '@/shared';
import {
    type ICollectionModel,
    type CreateValue,
    type IListModel,
    type IRequestModel,
    CollectionModel,
    ListModel,
    RequestModel,
} from '@/shared-client';
import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { Api, type IEquipmentDTO } from '~/api';
import { dates } from '~/utils';

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
    collectionActions: ICollectionModel<IEquipmentAction, IEquipmentActionValue>;
    collection: ICollectionModel<IEquipment, IEquipmentValue>;
    list: IListModel<IEquipment, IEquipmentValue>;
    searchList: IListModel<IEquipment, IEquipmentValue>;
    listMineDetectors: IEquipment[];
    firstMineDetector: IEquipment | undefined;
    append(res: IEquipmentDTO[], isSearch: boolean, isMore?: boolean): void;
    create: IRequestModel<[CreateValue<IEquipmentValue>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel<[search?: string]>;
    fetchMoreList: IRequestModel<[search?: string]>;
    fetchItem: IRequestModel<[string]>;
}

export class EquipmentStore implements IEquipmentStore {
    collectionActions = new CollectionModel<IEquipmentAction, IEquipmentActionValue>({
        factory: (data: IEquipmentActionValue) => new EquipmentAction(data),
    });
    collection = new CollectionModel<IEquipment, IEquipmentValue>({
        factory: (data: IEquipmentValue) => new Equipment(data),
    });
    list = new ListModel<IEquipment, IEquipmentValue>({ collection: this.collection });
    searchList = new ListModel<IEquipment, IEquipmentValue>({ collection: this.collection });

    constructor() {
        makeAutoObservable(this);
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
        run: async (data: CreateValue<IEquipmentValue>) => {
            const res = await Api.equipment.create(createEquipmentDTO(data));
            this.list.unshift(createEquipment(res));
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await Api.equipment.remove(id);

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

            const res = await Api.equipment.getList({
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

            const res = await Api.equipment.getList({
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
            const res = await Api.equipment.get(id);

            this.collection.set(res.id, createEquipment(res));
        },
        onError: () => message.error('Виникла помилка'),
    });
}
