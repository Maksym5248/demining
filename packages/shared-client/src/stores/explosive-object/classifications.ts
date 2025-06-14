import { makeAutoObservable, reaction } from 'mobx';
import { EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { type ITreeNode } from '~/common';
import { type ICollectionModel, type IListModel } from '~/models';

import {
    type IExplosiveObjectClass,
    type IExplosiveObjectClassData,
    type IExplosiveObjectClassItem,
    type IExplosiveObjectClassItemData,
} from './entities';

export interface IClassifications {
    init(): void;
    get(id?: string): INode;
    create(item: IExplosiveObjectClassItem): void;
    remove(id: string): void;
    move(id: string, newParentId?: string | null, oldParentId?: string | null): void;
    getBy(params: { typeId: string; component?: EXPLOSIVE_OBJECT_COMPONENT }): INode[];
    getParents(id: string): INode[];
    getParent(id: string): INode;
    flatten(typeId: string): INode[];
    flattenSections(typeId?: string): (ISectionNode | INode | IClassNode)[];
    getSections(typeId?: string): (ISectionNode | INode | IClassNode)[];
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

type ITypeId = string;
type IClassItemId = string;

export enum TypeNodeClassification {
    ClassItem = 'classItem',
    Class = 'class',
    Section = 'section',
}

export interface INode extends ITreeNode<IExplosiveObjectClassItem> {
    classId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    type: TypeNodeClassification;
    parents: INode[];
    children: INode[];
    flatten: INode[];
    lastChild: INode;
    isLast: boolean;
    add(item: INode): void;
}

export interface IClassNode extends Pick<INode, 'id' | 'displayName' | 'type' | 'deep' | 'isLast'> {
    children?: INode[];
}
export interface ISectionNode extends Pick<INode, 'id' | 'displayName' | 'type' | 'deep' | 'isLast'> {
    children?: IClassNode[];
}

class Node implements INode {
    item: IExplosiveObjectClassItem;
    children: INode[] = [];
    type = TypeNodeClassification.ClassItem;
    classifications: IClassifications;

    constructor(item: IExplosiveObjectClassItem, classifications: IClassifications) {
        this.item = item;
        this.classifications = classifications;

        makeAutoObservable(this);

        reaction(
            () => this.item.data.parentId, // The reactive expression
            (newValue, oldValue) => {
                const parentId = this.classifications.get(newValue ?? '') ? newValue : null;
                this.classifications.move(this.item.data.id, parentId, oldValue);
            },
        );
    }

    get classId() {
        return this.item.data.classId;
    }

    get component() {
        return this.item.data.component;
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

    get parent() {
        return this.parents[0];
    }

    get deep() {
        return this.parents.length;
    }

    get path() {
        return this.parents.map(item => item.id).join('/');
    }

    get lastChild() {
        return this.children[this.children.length - 1];
    }

    get isLast() {
        return this.parent?.lastChild.id === this.id;
    }

    add(item: INode) {
        this.children.push(item);
    }

    remove(id: string) {
        this.children = this.children.filter(item => item.id !== id);
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

        makeAutoObservable(this);
    }

    private createNode(data: IExplosiveObjectClassItem) {
        this.nodes[data.data.id] = new Node(data, this);
    }

    private removeNode(id: string) {
        delete this.nodes[id];
    }

    private getNode(id: string) {
        return this.nodes[id];
    }

    private bind(id: string) {
        const item = this.getNode(id);

        if (item.item.data.parentId) {
            const parent = this.getNode(item.item.data.parentId);
            parent?.add(item);
        } else if (this.roots[item.item.data.typeId]) {
            this.roots[item.item.data.typeId].push(item);
        } else {
            this.roots[item.item.data.typeId] = [item];
        }
    }

    get(id: string) {
        return this.getNode(id);
    }

    getBy(params: { typeId: string; component?: EXPLOSIVE_OBJECT_COMPONENT }) {
        let res = this.roots[params.typeId] ?? [];

        if (params.component) {
            res = res.filter(item => item.component === params.component);
        }

        return res;
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

    getParent(id: string) {
        return this.getParents(id)[0];
    }

    init() {
        if (this.isInitialized) return;
        this.lists.classItem.asArray.forEach(item => this.createNode(item));
        this.lists.classItem.asArray.forEach(item => this.bind(item.data.id));

        this.collections.classItem.onRemoved?.(id => this.remove(id));
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
            parent.children = parent.children.filter(node => node.id !== id);
        } else if (this.roots[item.item.data.typeId]) {
            this.roots[item.item.data.typeId] = this.roots[item.item.data.typeId].filter(node => node.id !== id);
        }

        this.removeNode(id);
    }

    move(id: string, newParentId?: string | null, oldParentId?: string | null) {
        const item = this.getNode(id);

        if (oldParentId) {
            const parent = this.getNode(oldParentId);
            parent?.remove(id);
        }

        if (newParentId) {
            const newParent = this.getNode(newParentId);
            newParent?.add(item);
        } else {
            this.roots[item.item.data.typeId].push(item);
        }
    }

    flatten(typeId: string) {
        return this.getBy({ typeId }).reduce((acc, item) => [...acc, ...item.flatten], [] as INode[]);
    }

    flattenSections(typeId?: string) {
        if (!typeId) return [];

        const res: (ISectionNode | INode | IClassNode)[] = [];
        const sections: EXPLOSIVE_OBJECT_COMPONENT[] = [];

        this.flatten(typeId).forEach(item => {
            const prev = res[res.length - 1];

            if (item.component === EXPLOSIVE_OBJECT_COMPONENT.AMMO && !sections.includes(item.component)) {
                res.push({
                    id: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
                    displayName: 'Боєприпаси',
                    type: TypeNodeClassification.Section,
                } as ISectionNode);
                sections.push(item.component);
            } else if (item.component === EXPLOSIVE_OBJECT_COMPONENT.FUSE && !sections.includes(item.component)) {
                res.push({
                    id: EXPLOSIVE_OBJECT_COMPONENT.FUSE,
                    displayName: 'Підривники',
                    type: TypeNodeClassification.Section,
                } as ISectionNode);
                sections.push(item.component);
            }

            if ((prev as INode)?.classId !== item.classId) {
                const classification = this.collections.class.get(item.classId);
                res.push({
                    id: item.classId,
                    displayName: classification?.displayName,
                    type: TypeNodeClassification.Class,
                    deep: item.deep,
                } as IClassNode);
            }

            res.push(item);
        });

        return res;
    }

    getSections(typeId?: string) {
        if (!typeId) return [];

        const sections: ISectionNode[] = [
            {
                id: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
                displayName: 'Боєприпаси',
                type: TypeNodeClassification.Section,
                deep: 0,
                children: [],
                isLast: false,
            },
            {
                id: EXPLOSIVE_OBJECT_COMPONENT.FUSE,
                displayName: 'Підривники',
                type: TypeNodeClassification.Section,
                deep: 0,
                children: [],
                isLast: false,
            },
            {
                id: EXPLOSIVE_OBJECT_COMPONENT.FERVOR,
                displayName: 'Запал',
                type: TypeNodeClassification.Section,
                deep: 0,
                children: [],
                isLast: false,
            },
        ];

        const getSection = (component: EXPLOSIVE_OBJECT_COMPONENT) => sections.find(item => item.id === component?.valueOf());
        const getClassification = (section?: ISectionNode, classId?: string) => section?.children?.find(item => item.id === classId);

        const createClassification = (section?: ISectionNode, classId?: string) => {
            const classification = getClassification(section, classId);

            if (!classification) {
                const res = this.collections.class.get(classId);
                if (!res) return;

                section?.children?.push({
                    id: res.id,
                    displayName: res?.displayName,
                    type: TypeNodeClassification.Class,
                    deep: 1,
                    children: [],
                    isLast: false,
                });
            }
        };

        const items = this.getBy({ typeId });

        items.forEach(item => {
            const section = getSection(item.component);
            createClassification(section, item.classId);
        });

        sections.forEach(section => {
            const last = section.children?.[section.children.length - 1];
            last && (last.isLast = true);
        });

        items.forEach(item => {
            const section = getSection(item.component);
            const classs = getClassification(section, item.classId);
            classs?.children?.push(...item.flatten);
        });

        return sections.filter(el => !!el.children?.length);
    }
}
