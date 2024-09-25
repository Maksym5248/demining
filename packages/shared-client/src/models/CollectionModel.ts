import { get, has, remove, set, makeAutoObservable } from 'mobx';
import { path } from 'shared-my';

type ID = string | number;

export interface ICollectionModel<T, B> {
    get: (id?: ID) => T | undefined;
    set: (id: ID, value: B) => void;
    update: (id: ID, value: B) => void;
    setArr: (arr: (B & { id: string })[]) => void;
    remove: (id: string) => void;
    exist: (id: string) => boolean;
    findBy(path: string, value: unknown): T | undefined;
    onRemoved?: (fn: (id: string) => void) => void;
}

interface ICollectionModelParams<T extends { data: B }, B> {
    factory?: (data: B) => T;
    model?: new (data: B) => T;
}

interface CallBacks {
    removed: ((id: string) => void)[];
}

export class CollectionModel<T extends { data: B }, B> implements ICollectionModel<T, B> {
    private collection: Record<string, T> = {};

    model?: new (data: B) => T;
    factory: (data: B) => T;
    private callBacks: CallBacks = {
        removed: [],
    };
    constructor({ factory, model }: ICollectionModelParams<T, B>) {
        const defaultFactory = model ? (data: B) => new model(data) : (data: B) => data as unknown as T;
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
        Object.assign(item.data, value);
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
        this.callBacks.removed.forEach((fn) => fn(id));
    }

    exist(id: string) {
        return has(this.collection, id);
    }

    onRemoved(fn: (id: string) => void) {
        this.callBacks.removed.push(fn);
    }
}
