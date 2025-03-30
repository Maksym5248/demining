import { makeAutoObservable } from 'mobx';
import { EQUIPMENT_TYPE } from 'shared-my';

import { type IEquipmentAPI } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IEquipment,
    type IEquipmentData,
    Equipment,
    createEquipment,
    createEquipmentDTO,
    EquipmentAction,
    type IEquipmentActionData,
    type IEquipmentAction,
} from './entities';

export interface IEquipmentStore {
    collectionActions: CollectionModel<IEquipmentAction, IEquipmentActionData>;
    collection: CollectionModel<IEquipment, IEquipmentData>;
    list: ListModel<IEquipment, IEquipmentData>;
    listMineDetectors: IEquipment[];
    firstMineDetector: IEquipment | undefined;
    create: RequestModel<[ICreateValue<IEquipmentData>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
}

interface IServices {
    message: IMessage;
}

interface IApi {
    equipment: IEquipmentAPI;
}

export class EquipmentStore implements IEquipmentStore {
    api: IApi;
    services: IServices;

    collectionActions = new CollectionModel<IEquipmentAction, IEquipmentActionData>({
        factory: (data: IEquipmentActionData) => new EquipmentAction(data, this),
    });
    collection = new CollectionModel<IEquipment, IEquipmentData>({
        factory: (data: IEquipmentData) => new Equipment(data, this),
    });
    list = new ListModel<IEquipment, IEquipmentData>({ collection: this.collection });

    constructor(params: { api: IApi; services: IServices }) {
        makeAutoObservable(this);
        this.api = params.api;
        this.services = params.services;
    }

    get listMineDetectors() {
        return this.list.asArray.filter(el => el.data.type === EQUIPMENT_TYPE.MINE_DETECTOR);
    }

    get firstMineDetector() {
        return this.listMineDetectors[0];
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IEquipmentData>) => {
            const res = await this.api.equipment.create(createEquipmentDTO(data));
            this.list.unshift(createEquipment(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.equipment.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.equipment.getList({
                search,
                limit: this.list.pageSize,
            });

            this.list.set(res.map(createEquipment));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.equipment.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createEquipment));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.equipment.get(id);

            this.collection.set(res.id, createEquipment(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
