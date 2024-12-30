import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassAPI } from '~/api';
import { data, type IUpdateValue } from '~/common';
import { type IListModel, type ICollectionModel, TreeModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { createExplosiveObjectClass, updateExplosiveObjectClassDTO, type IExplosiveObjectClassData } from './explosive-object-class.schema';
import { type IExplosiveObjectClassItem, type IExplosiveObjectClassItemData } from '../explosive-object-class-item';

export interface IExplosiveObjectClass {
    data: IExplosiveObjectClassData;
    id: string;
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectClassData>): void;
    treeItems: TreeModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    items: IExplosiveObjectClassItem[];
    itemsIds: string[];
    getItemsByIds(ids: string[]): IExplosiveObjectClassItem[];
    getItemsIdsByIds(ids: string[]): string[];
    getItemsIdsByExludedIds(ids: string[]): string[];
    getItem(id?: string): IExplosiveObjectClassItem | undefined;
    isRootItems(potentialParentIds: string[]): boolean;
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

    get items() {
        return this.lists.classItem.asArray.filter((item) => this.data.id === item.data.classId);
    }

    get itemsMap() {
        return this.items.reduce(
            (acc, item) => {
                acc[item.data.id] = item;
                return acc;
            },
            {} as Record<string, IExplosiveObjectClassItem>,
        );
    }

    getItem(id?: string) {
        return id ? this.itemsMap[id] : undefined;
    }

    get itemsIds() {
        return this.items.map((item) => item.data.id);
    }

    get treeItems() {
        const nodes = data.buildTreeNodes<IExplosiveObjectClassItem>(this.items);
        const tree = new TreeModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>();
        tree.set(nodes);

        return tree;
    }

    isRootItems(potentialParentIds: string[]) {
        return !!this.items.filter((item) => !item.data.parentId || potentialParentIds.includes(item.data.parentId)).length;
    }

    getItemsByIds(ids: string[]) {
        return ids.map((id) => this.getItem(id)).filter(Boolean) as IExplosiveObjectClassItem[];
    }

    getItemsIdsByIds(ids: string[]) {
        const items = this.getItemsByIds(ids);
        return items.map((item) => item.data.id);
    }

    getItemsIdsByExludedIds(ids: string[]) {
        const items = this.getItemsByIds(ids);
        return ids.filter((id) => !items.find((el) => el?.data.id === id));
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
