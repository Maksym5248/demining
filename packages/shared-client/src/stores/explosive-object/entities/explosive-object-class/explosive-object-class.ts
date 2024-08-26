import { makeAutoObservable } from 'mobx';

import { data } from '~/common';
import { type IListModel, type ICollectionModel, TreeModel } from '~/models';

import { type IExplosiveObjectClassData } from './explosive-object-class.schema';
import { type IExplosiveObjectClassItem, type IExplosiveObjectClassItemData } from '../explosive-object-class-item';

export interface IExplosiveObjectClass {
    data: IExplosiveObjectClassData;
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectClassData>): void;
    itemsTree: TreeModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    items: IExplosiveObjectClassItem[];
}

interface IExplosiveObjectClassParams {
    collections: ICollections;
    lists: ILists;
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

    constructor(data: IExplosiveObjectClassData, { collections, lists }: IExplosiveObjectClassParams) {
        this.collections = collections;
        this.lists = lists;

        this.data = data;
        makeAutoObservable(this);
    }

    get displayName() {
        return this.data.name;
    }

    get items() {
        return this.lists.classItem.asArray.filter((item) => this.data.id === item.data.classId);
    }

    get itemsTree() {
        const nodes = data.buildTreeNodes<IExplosiveObjectClassItem>(this.items);
        const tree = new TreeModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>();
        tree.set(nodes);

        return tree;
    }

    updateFields(data: Partial<IExplosiveObjectClassData>) {
        Object.assign(this.data, data);
    }
}
