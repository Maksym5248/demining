import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { type ICollectionModel, type IListModel } from '~/models';

import {
    type IExplosiveObjectClass,
    type IExplosiveObjectClassData,
    type IExplosiveObjectClassItem,
    type IExplosiveObjectClassItemData,
} from './entities';

export interface IClassifications {
    build(): void;
    get(typeId: string, component?: EXPLOSIVE_OBJECT_COMPONENT): IClassNode[];
    flatten(typeId: string, component?: EXPLOSIVE_OBJECT_COMPONENT): (IClassNode | IClassItemNode)[];
    flattenSections(typeId: string): (IClassNode | IClassItemNode | ISectionNode)[];
}

// 1. Видалити EXPLOSIVE_OBJECT_CLASS та зробити окремий список для видів класифікації
// 2. дерево будувати тільки на основі classItem

// Може взагалі краще видалити class ?
// За призначенням:
// - протитанкові
//     За призначенням (parentId-classitem):
//     - протиднищеві
//     - протибортові
//     - протигусинечні
// - протипіхотні
//     За способом ураження (parentId-classitem):
//     - фугасні
//     - осколкові
//          За способом розльоту осколків (parentId-classitem):
//          - кругові
//          - напрвлені

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

type ITypeId = string;

export enum TypeNodeClassification {
    Class = 'class',
    ClassItem = 'classItem',
    Section = 'section',
}

export interface INode {
    id: string;
    displayName: string;
    type: TypeNodeClassification;
    flatten: INode[];
}

export interface IClassNode extends INode {
    class: IExplosiveObjectClass;
    children: IClassItemNode[];
}

export type ISectionNode = INode;

export interface IClassItemNode extends INode {
    classItem: IExplosiveObjectClassItem;
    children: IClassNode[];
}

class ClassItemNode implements INode {
    classItem: IExplosiveObjectClassItem;
    children: ClassNode[] = [];
    type = TypeNodeClassification.ClassItem;

    constructor(item: IExplosiveObjectClassItem) {
        this.classItem = item;
        makeAutoObservable(this);
    }

    get id() {
        return this.classItem.data.id;
    }

    get name() {
        return this.classItem.data.name;
    }

    get displayName() {
        return this.classItem.displayName;
    }

    get flatten(): (IClassNode | IClassItemNode)[] {
        return [this, ...this.children.reduce((acc, item) => [...acc, ...item.flatten], [] as (IClassNode | IClassItemNode)[])];
    }

    add(item: ClassNode) {
        this.children.push(item);
    }
}

class ClassNode implements INode {
    class: IExplosiveObjectClass;
    children: ClassItemNode[] = [];
    type = TypeNodeClassification.Class;

    constructor(item: IExplosiveObjectClass) {
        this.class = item;
        makeAutoObservable(this);
    }

    get id() {
        return this.class.data.id;
    }

    get name() {
        return this.class.data.name;
    }

    get displayName() {
        return this.class.displayName;
    }

    get flatten(): (IClassNode | IClassItemNode)[] {
        return [this, ...this.children.reduce((acc, item) => [...acc, ...item.flatten], [] as (IClassNode | IClassItemNode)[])];
    }

    add(item: ClassItemNode) {
        this.children.push(item);
    }
}

export class Classifications implements IClassifications {
    lists: IClassificationsParams['lists'];
    collections: IClassificationsParams['collections'];

    classes: Record<string, ClassNode> = {};
    items: Record<string, ClassItemNode> = {};
    roots: Record<ITypeId, ClassNode[]> = {};

    constructor(params: IClassificationsParams) {
        this.collections = params.collections;
        this.lists = params.lists;
    }

    createClass(data: IExplosiveObjectClass) {
        this.classes[data.data.id] = new ClassNode(data);
    }

    createClassItem(data: IExplosiveObjectClassItem) {
        this.items[data.data.id] = new ClassItemNode(data);
    }

    createRoot(id: string) {
        const item = this.getClass(id);

        if (this.roots[item.class.data.typeId]) {
            this.roots[item.class.data.typeId].push(this.getClass(id));
        } else {
            this.roots[item.class.data.typeId] = [this.getClass(id)];
        }
    }

    getClassItem(id: string) {
        return this.items[id];
    }

    getClass(id: string) {
        return this.classes[id];
    }

    build() {
        this.lists.class.asArray.forEach((item) => this.createClass(item));
        this.lists.classItem.asArray.forEach((item) => this.createClassItem(item));

        this.lists.class.asArray.forEach((item) => {
            if (item.data.parentId) {
                this.getClassItem(item.data.parentId).add(this.getClass(item.data.id));
            } else {
                this.createRoot(item.data.id);
            }
        });

        this.lists.classItem.asArray.forEach((item) => {
            this.getClass(item.data.classId).add(this.getClassItem(item.data.id));
        });
    }

    get(typeId: string, component?: EXPLOSIVE_OBJECT_COMPONENT) {
        const byTypes = this.roots[typeId] ?? [];
        return component ? byTypes.filter((node) => node.class.data.component === component) : byTypes;
    }

    flatten(typeId: string, component?: EXPLOSIVE_OBJECT_COMPONENT) {
        const items = this.get(typeId, component);
        return items.reduce((acc, item) => [...acc, ...item.flatten], [] as (IClassNode | IClassItemNode)[]);
    }

    flattenSections(typeId: string) {
        const ammo = this.flatten(typeId, EXPLOSIVE_OBJECT_COMPONENT.AMMO);
        const fuse = this.flatten(typeId, EXPLOSIVE_OBJECT_COMPONENT.FUSE);

        const items = [];

        if (ammo.length) {
            items.push({ id: 'ammo', displayName: 'Боєприпаси', type: TypeNodeClassification.Section } as ISectionNode);
            items.push(...ammo);
        }

        if (fuse.length) {
            items.push({ id: 'fuse', displayName: 'Підривники', type: TypeNodeClassification.Section } as ISectionNode);
            items.push(...fuse);
        }

        return items;
    }
}
