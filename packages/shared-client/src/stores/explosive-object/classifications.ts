import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { data } from '~/common';
import { TreeModel, type CollectionModel, type ListModel } from '~/models';

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
    collectionClasses: CollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    collectionClassesItems: CollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    listClasses: ListModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    listClassesItems: ListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
}

export class Classifications implements IClassifications {
    collectionClasses: CollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    collectionClassesItems: CollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    listClasses: ListModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    listClassesItems: ListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;

    constructor(params: IClassificationsParams) {
        this.collectionClasses = params.collectionClasses;
        this.collectionClassesItems = params.collectionClassesItems;
        this.listClasses = params.listClasses;
        this.listClassesItems = params.listClassesItems;
    }

    get treeItems() {
        const nodes = data.buildTreeNodes<IExplosiveObjectClassItem>(this.listClassesItems.asArray);
        const tree = new TreeModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>();
        tree.set(nodes);

        return tree;
    }

    getBy(typeId: string, component: EXPLOSIVE_OBJECT_COMPONENT) {
        return this.listClasses.asArray.filter((el) => el.data.typeId === typeId && el.data.component === component);
    }

    getItemsByIds(ids: string[]) {
        return ids.map((id) => this.collectionClassesItems.get(id)).filter(Boolean) as IExplosiveObjectClassItem[];
    }
}
