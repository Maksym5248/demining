import { get, has, remove, set, makeAutoObservable } from 'mobx';

import { path } from '~/utils/data-type/object';

type ID = string | number;

export interface ICollectionModel<T, B> {
    get: (id?: ID) => T | undefined;
    set: (id: ID, value: B) => void;
    update: (id: ID, value: B | T) => void;
    setArr: (arr: (B & { id: string })[]) => void;
    remove: (id: string) => void;
    exist: (id: string) => boolean;
    findBy(path: string, value: unknown): T | undefined;
}

interface ICollectionModelParams<T extends B, B> {
    factory?: (data: B) => T;
    model?: new (data: B) => T;
}

export class CollectionModel<T extends B, B> implements ICollectionModel<T, B> {
    private collection: Record<string, T> = {};

    model?: new (data: B) => T;
    factory: (data: B) => T;

    constructor({ factory, model }: ICollectionModelParams<T, B>) {
        const defaultFactory = model ? (data: B) => new model(data) : (data: B) => data as T;
        this.factory = factory ?? defaultFactory;
        makeAutoObservable(this);
    }

    private get asArray() {
        return Object.values(this.collection);
    }

    setArr(values: (B & { id: string })[]) {
        values.forEach((el) => {
            this.set(el.id, el);
        });
    }

    set(id: ID, value: B) {
        const stringId = String(id);
        if (this.exist(stringId)) {
            this.update(id, value);
        } else {
            set(this.collection, stringId, this.factory(value));
        }
    }

    update(id: ID, value: B) {
        const stringId = String(id);

        const item = get(this.collection, stringId);
        Object.assign(item, value);
    }

    get(id?: ID): T | undefined {
        if (typeof id === 'string') {
            return get(this.collection, id) as T;
        }
        return this.findBy('id', id);
    }

    findBy(pathToItem: string, value: unknown): T | undefined {
        return this.asArray.find((v: T) => path(v, pathToItem) === value);
    }

    remove(id: string) {
        remove(this.collection, id);
    }

    exist(id: string) {
        return has(this.collection, id);
    }
}
