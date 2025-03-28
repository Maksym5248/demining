import { get, has, remove, set, makeAutoObservable, values } from 'mobx';
import { path } from 'shared-my';

import { type Path } from '~/common';

import { type IData, type IDataModel } from './DataModel';

type ID = string;

export interface ICollectionModel<T extends IDataModel<B>, B extends IData> {
    get: (id?: ID) => T | undefined;
    set: (id: ID, value: B) => void;
    setArr: (arr: (B & { id: string })[]) => void;
    update: (id: ID, value: B) => void;
    updateArr: (values: (B & { id: string })[]) => void;
    remove: (id: string) => void;
    exist: (id: string) => boolean;
    findBy(path: string, value: unknown): T | undefined;
    onRemoved?: (fn: (id: string) => void) => void;
    onCreated?: (fn: (id: string, item: T) => void) => void;
    asArray: readonly T[];
}

interface ICollectionModelParams<T extends { data: B; id: ID }, B> {
    factory?: (data: B) => T;
    model?: new (data: B) => T;
}

interface CallBacks<T> {
    removed: ((id: string, item: T) => void)[];
    created: ((id: string, item: T) => void)[];
}

export interface SetParams<B> {
    (id: ID, value: B): void;
    (delta: number): void;
}

export class CollectionModel<T extends IDataModel<B>, B extends IData> implements ICollectionModel<T, B> {
    private collection: Record<string, T> = {};

    model?: new (data: B) => T;
    factory: (data: B) => T;

    private callBacks: CallBacks<T> = {
        removed: [],
        created: [],
    };
    constructor({ factory, model }: ICollectionModelParams<T, B>) {
        const defaultFactory = model ? (data: B) => new model(data) : (data: B) => data as unknown as T;
        this.factory = factory ?? defaultFactory;
        makeAutoObservable(this);
    }

    get asArray() {
        return values(this.collection);
    }

    setArr(values: (B & { id: string })[]) {
        const updateData: Record<string, B & { id: string }> = {};
        const createData: Record<string, T> = {};

        let canUpdate = false;
        let canCreate = false;

        values.forEach(value => {
            if (this.exist(value.id)) {
                canUpdate = true;
                updateData[value.id] = value;
            } else {
                canCreate = true;
                createData[value.id] = this.factory(value);
            }
        });

        if (canUpdate) {
            this.updateArr(Object.values(updateData));
        }

        if (canCreate) {
            set(this.collection, createData);
            Object.values(createData).forEach(item => {
                this.callBacks.created.forEach(fn => fn(item.id, item));
            });
        }
    }

    set(id: ID, value: B) {
        if (this.exist(id)) {
            this.update(id, value);
        } else {
            const model = this.factory(value);
            set(this.collection, { [id]: model });
            this.callBacks.created.forEach(fn => fn(id, model));
        }
    }

    update(id: ID, value: B) {
        const stringId = String(id);

        const item = get(this.collection, stringId);
        Object.assign(item.data, value);
    }

    updateArr(values: (B & { id: string })[]) {
        values.forEach(value => {
            this.update(value.id, value);
        });
    }

    get(id?: ID): T | undefined {
        return id ? get(this.collection, id) : undefined;
    }

    findBy(pathToItem: Path<T>, value: unknown): T | undefined {
        return this.asArray.find((v: T) => path(v, pathToItem) === value);
    }

    remove(id: string | string[]) {
        const data = Array.isArray(id) ? id : [id];

        data.forEach(id => {
            const item = get(this.collection, id);
            remove(this.collection, id);
            this.callBacks.removed.forEach(fn => fn(id, item));
        });
    }

    exist(id: string) {
        return has(this.collection, id);
    }

    onRemoved(fn: (id: string) => void) {
        this.callBacks.removed.push(fn);
    }

    onCreated(fn: (id: string, item: T) => void) {
        this.callBacks.created.push(fn);
    }
}
