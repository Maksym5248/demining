import { makeAutoObservable } from 'mobx';

import { type TreeNode } from '~/common';
import { type IListModel, type ICollectionModel } from '~/models';

import { type IExplosiveObjectClassData } from './explosive-object-class.schema';
import { type IExplosiveObjectClassItem, type IExplosiveObjectClassItemData } from '../explosive-object-class-item';

function buildTreeForClass(items: IExplosiveObjectClassItem[]): TreeNode<IExplosiveObjectClassItem>[] {
    const itemMap: { [key: string]: TreeNode<IExplosiveObjectClassItem> } = {};
    const roots: TreeNode<IExplosiveObjectClassItem>[] = [];

    try {
        items.forEach((item) => {
            itemMap[item.data.id] = { id: item.data.id, item, children: [] };
        });

        items.forEach((item) => {
            if (item.data.parentId && itemMap[item.data.parentId]) {
                itemMap[item.data.parentId].children.push(itemMap[item.data.id]);
            } else {
                roots.push(itemMap[item.data.id]);
            }
        });
    } catch (error) {
        console.log('error', error);
    }

    return roots;
}

export interface IExplosiveObjectClass {
    data: IExplosiveObjectClassData;
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectClassData>): void;
    childrenTree: TreeNode<IExplosiveObjectClassItem>[];
    childrenItems: IExplosiveObjectClassItem[];
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

    get childrenItems() {
        return this.lists.classItem.asArray.filter((item) => this.data.id === item.data.classId);
    }

    get childrenTree() {
        return buildTreeForClass(this.childrenItems);
    }

    updateFields(data: Partial<IExplosiveObjectClassData>) {
        Object.assign(this.data, data);
    }
}
