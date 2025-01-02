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
    init(): void;
    get(typeId: string, component?: EXPLOSIVE_OBJECT_COMPONENT): INode[];
    create(item: IExplosiveObjectClassItem): void;
    remove(id: string): void;
    getParents(id: string): INode[];
    flatten(typeId: string, component?: EXPLOSIVE_OBJECT_COMPONENT): INode[];
    flattenSections(typeId: string): (INode | ISectionNode)[];
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
type IClassItemId = string;

export enum TypeNodeClassification {
    ClassItem = 'classItem',
    Class = 'class',
    Section = 'section',
}

export interface INode {
    id: string;
    displayName: string;
    type: TypeNodeClassification;
    parents: INode[];
    deep: number;
    path: string;
    flatten: INode[];
}

export type ISectionNode = INode;

class Node implements INode {
    item: IExplosiveObjectClassItem;
    children: INode[] = [];
    type = TypeNodeClassification.ClassItem;
    classifications: IClassifications;

    constructor(item: IExplosiveObjectClassItem, classifications: IClassifications) {
        this.item = item;
        this.classifications = classifications;

        makeAutoObservable(this);
    }

    get id() {
        return this.item.data.id;
    }

    get name() {
        return this.item.data.name;
    }

    get displayName() {
        return this.item.displayName;
    }

    get flatten(): INode[] {
        return [this, ...this.children.reduce((acc, item) => [...acc, ...item.flatten], [] as INode[])];
    }

    get parents() {
        return this.classifications.getParents(this.id);
    }

    get deep() {
        return this.parents.length;
    }

    get path() {
        return this.parents.map((item) => item.id).join('/');
    }

    add(item: INode) {
        this.children.push(item);
    }
}

export class Classifications implements IClassifications {
    isInitialized = false;

    lists: IClassificationsParams['lists'];
    collections: IClassificationsParams['collections'];

    nodes: Record<IClassItemId, Node> = {};
    roots: Record<ITypeId, Node[]> = {};

    constructor(params: IClassificationsParams) {
        this.collections = params.collections;
        this.lists = params.lists;
    }

    createNode(data: IExplosiveObjectClassItem) {
        this.nodes[data.data.id] = new Node(data, this);
    }

    bind(id: string) {
        const item = this.getNode(id);

        if (item.item.data.parentId) {
            const parent = this.getNode(item.item.data.parentId);
            parent.add(item);
        } else if (this.roots[item.item.data.typeId]) {
            this.roots[item.item.data.typeId].push(item);
        } else {
            this.roots[item.item.data.typeId] = [item];
        }
    }

    getNode(id: string) {
        return this.nodes[id];
    }

    getParents(id: string) {
        let current = this.getNode(id);
        const path = [];

        while (current.item.data.parentId) {
            const parent = this.getNode(current.item.data.parentId);
            path.push(parent);
            current = parent;
        }

        return path;
    }

    init() {
        if (this.isInitialized) return;

        this.lists.classItem.asArray.forEach((item) => this.createNode(item));
        this.lists.classItem.asArray.forEach((item) => this.bind(item.data.id));

        this.collections.classItem.onRemoved?.((id) => this.remove(id));
        this.collections.classItem.onCreated?.((id, item) => this.create(item));

        this.isInitialized = true;
    }

    create(item: IExplosiveObjectClassItem) {
        this.createNode(item);
        this.bind(item.data.id);
    }

    remove(id: string) {
        const item = this.getNode(id);

        if (item.item.data.parentId) {
            const parent = this.getNode(item.item.data.parentId);
            parent.children = parent.children.filter((node) => node.id !== id);
        } else if (this.roots[item.item.data.typeId]) {
            this.roots[item.item.data.typeId] = this.roots[item.item.data.typeId].filter((node) => node.id !== id);
        }

        delete this.nodes[id];
    }

    get(typeId: string, component?: EXPLOSIVE_OBJECT_COMPONENT) {
        const byTypes = this.roots[typeId] ?? [];
        return component ? byTypes.filter((node) => node.item.data.component === component) : byTypes;
    }

    flatten(typeId: string, component?: EXPLOSIVE_OBJECT_COMPONENT) {
        const items = this.get(typeId, component);
        return items.reduce((acc, item) => [...acc, ...item.flatten], [] as INode[]);
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
