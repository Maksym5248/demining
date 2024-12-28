import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { data } from '~/common';
import { type ICollectionModel, type IListModel, TreeModel } from '~/models';

import {
    type IExplosiveObjectClass,
    type IExplosiveObjectClassData,
    type IExplosiveObjectClassItem,
    type IExplosiveObjectClassItemData,
} from './entities';

export interface IClassifications {
    getBy(typeId: string, component: EXPLOSIVE_OBJECT_COMPONENT): IExplosiveObjectClass[];
    getItemsByIds(ids: string[]): IExplosiveObjectClassItem[];
    treeItems: TreeModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
}

interface IClassificationsParams {
    lists: {
        class: IListModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
        classItem: IListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    };
    collections: {
        class: ICollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
        classItem: ICollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    };
}

export class Classifications implements IClassifications {
    lists: IClassificationsParams['lists'];
    collections: IClassificationsParams['collections'];

    constructor(params: IClassificationsParams) {
        this.collections = params.collections;
        this.lists = params.lists;
    }

    get treeItems() {
        const nodes = data.buildTreeNodes<IExplosiveObjectClassItem>(this.lists.classItem.asArray);
        const tree = new TreeModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>();
        tree.set(nodes);

        return tree;
    }

    getBy(typeId: string, component: EXPLOSIVE_OBJECT_COMPONENT) {
        return this.lists.class.asArray.filter((el) => el.data.typeId === typeId && el.data.component === component);
    }

    getItemsByIds(ids: string[]) {
        return ids.map((id) => this.collections.classItem.get(id)).filter(Boolean) as IExplosiveObjectClassItem[];
    }
}
