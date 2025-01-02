import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IListModel, type ICollectionModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { createExplosiveObjectClass, updateExplosiveObjectClassDTO, type IExplosiveObjectClassData } from './explosive-object-class.schema';
import { type IExplosiveObjectClassItem, type IExplosiveObjectClassItemData } from '../explosive-object-class-item';

export interface IExplosiveObjectClass {
    data: IExplosiveObjectClassData;
    id: string;
    displayName: string;
    update: RequestModel<[IUpdateValue<Omit<IExplosiveObjectClassData, 'typeId'>>]>;
}

interface IApi {
    explosiveObjectClass: IExplosiveObjectClassAPI;
}

interface IServices {
    message: IMessage;
}

interface IExplosiveObjectClassParams {
    collections: ICollections;
    lists: ILists;
    services: IServices;
    api: IApi;
}

interface ICollections {
    classItem: ICollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
}

interface ILists {
    classItem: IListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
}

export class ExplosiveObjectClass implements IExplosiveObjectClass {
    data: IExplosiveObjectClassData;
    collections: ICollections;
    lists: ILists;
    api: IApi;
    services: IServices;

    constructor(data: IExplosiveObjectClassData, params: IExplosiveObjectClassParams) {
        this.collections = params.collections;
        this.lists = params.lists;
        this.api = params.api;
        this.services = params.services;

        this.data = data;
        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<Omit<IExplosiveObjectClassData, 'typeId'>>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<Omit<IExplosiveObjectClassData, 'typeId'>>) => {
            const res = await this.api.explosiveObjectClass.update(this.data.id, updateExplosiveObjectClassDTO(data));
            this.updateFields(createExplosiveObjectClass({ ...res, typeId: this.data.typeId }));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
