import { makeAutoObservable } from 'mobx';
import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { type ICollectionModel, type IListModel } from '~/models';

import {
    type IExplosiveObjectClass,
    type IExplosiveObjectClassData,
    type IExplosiveObjectClassItem,
    type IExplosiveObjectClassItemData,
} from './entities';

export interface IClassifications {
    build(): void;
    get(typeId: string, component: EXPLOSIVE_OBJECT_COMPONENT): IClassNode[];
}

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

interface INode {
    id: string;
    name: string;
}

interface IClassNode extends INode {
    class: IExplosiveObjectClass;
    items: IClassItemNode[];
}

interface IClassItemNode extends INode {
    classItem: IExplosiveObjectClassItem;
    items: IClassNode[];
}

class ClassItemNode implements INode {
    classItem: IExplosiveObjectClassItem;
    items: ClassNode[] = [];

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

    add(item: ClassNode) {
        this.items.push(item);
    }
}

class ClassNode implements INode {
    class: IExplosiveObjectClass;
    items: ClassItemNode[] = [];

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

    add(item: ClassItemNode) {
        this.items.push(item);
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
        if (this.roots[id]) {
            this.roots[id].push(this.getClass(id));
        } else {
            this.roots[id] = [this.getClass(id)];
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

    get(typeId: string, component: EXPLOSIVE_OBJECT_COMPONENT) {
        const byTypes = this.roots[typeId];
        return byTypes.filter((node) => node.class.data.component === component);
    }
}
