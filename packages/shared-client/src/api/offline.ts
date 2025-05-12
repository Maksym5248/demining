import { type IBaseDB } from 'shared-my';

import {
    type IDBRemote,
    type IQuery,
    type ISubscriptionDocument,
    type IDBLocal,
    type IDocumentChangeType,
    type ICreateData,
} from '~/common';

export interface IDBOfflineFirst<T extends IBaseDB> {
    create: (value: ICreateData<T>) => Promise<T>;
    update: (id: string, value: Partial<T>) => Promise<T>;
    remove: (id: string) => Promise<string>;
    select: (query?: IQuery) => Promise<T[]>;
    get: (id: string) => Promise<T>;
    subscribe: (query: IQuery | null, callback: (data: ISubscriptionDocument<T>[]) => void) => Promise<void>;
}

const createMap = <T extends IBaseDB>(data: T[]): Record<string, T> => {
    const map: Record<string, T> = {};

    data.forEach(item => {
        map[item.id] = item;
    });

    return map;
};

const createAdded = <T extends IBaseDB>(data: T[]): ISubscriptionDocument<T>[] => {
    return data.map((item, i) => ({
        type: 'added' as const,
        newIndex: i,
        oldIndex: i,
        data: item,
    }));
};

export class DBOfflineFirst<T extends IBaseDB> implements IDBOfflineFirst<T> {
    constructor(
        private dbRemote: IDBRemote<T>,
        private dbLocal: IDBLocal<T>,
    ) {}

    create = async (value: ICreateData<T>): Promise<T> => {
        const res = await this.dbRemote.create(value);
        await this.dbLocal.create(res);
        return res;
    };

    update = async (id: string, value: Partial<T>): Promise<T> => {
        const res = await this.dbRemote.update(id, value);
        if (!res) throw new Error('there is entity by id');
        await this.dbLocal.update(id, res);

        return res;
    };

    remove = async (id: string) => {
        await this.dbRemote.update(id, { isDeleted: true } as Partial<T>);
        await this.dbLocal.remove(id);

        return id;
    };

    async select(query?: IQuery): Promise<T[]> {
        const q: IQuery = {
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        };

        let res = await this.dbLocal.select(q);

        if (!res.length) {
            res = await this.dbRemote.select({
                ...q,
                where: {
                    ...(q.where ?? {}),
                    ['!=']: { isDeleted: true },
                },
                ...(query ?? {}),
            });

            await Promise.all(
                res.map(async item => {
                    if (await this.dbLocal.exist('id', item.id)) {
                        await this.dbLocal.update(item.id, item);
                    } else {
                        await this.dbLocal.create(item);
                    }
                }),
            );
        }

        return res;
    }

    async get(id: string): Promise<T> {
        let res = await this.dbLocal.get(id);

        if (!res) {
            res = await this.dbRemote.get(id);
        }

        res = await this.dbRemote.get(id);
        if (!res || !!res?.isDeleted) throw new Error('there is explosiveObject with id');
        return res;
    }

    private async subscribeNewUpdates(q: IQuery | null, data: T[], callback?: (data: ISubscriptionDocument<T>[]) => void) {
        const map = createMap(data);

        const newData = await this.dbRemote.select({
            ...q,
            startAfter: data[data.length - 1].updatedAt,
        });

        const sorted = newData.map((item, i) => {
            let type: IDocumentChangeType = 'added';

            if (item?.isDeleted) {
                type = 'removed';
            } else if (map[item.id]) {
                type = 'modified';
            }

            return {
                type,
                newIndex: i,
                oldIndex: i,
                data: item,
            };
        });

        sorted.forEach(item => {
            if (item.type === 'added') {
                this.dbLocal.create(item.data);
            } else if (item.type === 'modified') {
                this.dbLocal.update(item.data.id, item.data);
            } else if (item.type === 'removed') {
                this.dbLocal.remove(item.data.id);
            }
        });

        if (!callback) return;

        callback?.(sorted);

        this.dbRemote.subscribe(
            {
                ...q,
                startAfter: newData[newData.length - 1].updatedAt,
            },
            (data: ISubscriptionDocument<T>[]) => {
                data.forEach(el => {
                    if (el.type === 'added') {
                        this.dbLocal.create(el.data);
                    } else if (el.type === 'modified') {
                        this.dbLocal.update(el.data.id, el.data);
                    } else if (el.type === 'removed') {
                        this.dbLocal.remove(el.data.id);
                    }
                });

                callback(data);
            },
        );
    }

    async subscribe(query: IQuery | null, callback: (data: ISubscriptionDocument<T>[]) => void) {
        const q: IQuery = {
            order: {
                by: 'updatedAt',
                type: 'desc',
            },
            ...(query ?? {}),
        };

        let data = await this.dbLocal.select(q);

        if (data.length) {
            this.subscribeNewUpdates(q, data, callback);
        } else {
            data = await this.dbRemote.select({
                ...q,
                where: {
                    ...(q.where ?? {}),
                    ['!=']: { isDeleted: true },
                },
            });

            data.forEach(item => {
                this.dbLocal.create(item);
            });

            this.dbRemote.subscribe(
                {
                    ...q,
                    startAfter: data[data.length - 1].updatedAt,
                },
                (data: ISubscriptionDocument<T>[]) => {
                    data.forEach(el => {
                        if (el.type === 'added') {
                            this.dbLocal.create(el.data);
                        } else if (el.type === 'modified') {
                            this.dbLocal.update(el.data.id, el.data);
                        } else if (el.type === 'removed') {
                            this.dbLocal.remove(el.data.id);
                        }
                    });

                    callback(data);
                },
            );
        }

        callback?.(createAdded(data));
    }
}
