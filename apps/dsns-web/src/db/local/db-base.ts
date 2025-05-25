import { merge } from 'lodash';
import { cloneDeep, type IBaseDB } from 'shared-my';
import {
    type IQuery,
    type ICreateData,
    type IWhere,
    type IDBLocal,
    convertTimestamps,
    limit,
    order,
    search,
    startAfter,
    where,
} from 'shared-my-client';
import { v4 as uuid } from 'uuid';

import { type IDBConnection } from './db.connetion';

export class DBBase<T extends IBaseDB> implements IDBLocal<T> {
    tableName: string;
    rootCollection?: string;

    constructor(
        tableName: string,
        private searchFields: (keyof T)[],
        private db: IDBConnection,
    ) {
        this.tableName = tableName;
    }

    // ERROR: Failed to execute 'transaction' on 'IDBDatabase': A version change transaction is running.
    init(): void {}

    drop(): void {}

    private async transaction(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const transaction = this.db.connetion.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }

    async select(args?: Partial<IQuery>): Promise<T[]> {
        const store = await this.transaction(this.tableName, 'readonly');

        const data: T[] = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const result = request.result as T[];
                resolve(result);
            };
            request.onerror = () => reject(request.error);
        });

        const convertedData = data.map(item => convertTimestamps(item));
        const filtered = args?.where ? where(args, convertedData) : convertedData;
        const searched = args?.search ? search(args, this.searchFields, filtered) : filtered;
        const ordered = args?.order ? order(args, searched) : searched;
        const startedAfter = args?.startAfter ? startAfter(args, ordered) : ordered;
        const limited = args?.limit ? limit(args, startedAfter) : startedAfter;

        return limited;
    }

    async get(id: string): Promise<T | null> {
        const store = await this.transaction(this.tableName, 'readonly');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => {
                const result = request.result ? convertTimestamps(request.result) : null; // Convert Timestamps
                resolve(result);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getByIds(ids: string[]): Promise<T[]> {
        const results: T[] = [];
        for (const id of ids) {
            const item = await this.get(id);
            if (item) results.push(item);
        }
        return results;
    }

    async exist(field: keyof T, value: any): Promise<boolean> {
        if (field === 'id') {
            const data = await this.get(value);
            return !!data;
        } else {
            const data = await this.select({ where: { [field]: value }, limit: 1 });
            return data.length > 0;
        }
    }

    async create(value: ICreateData<T>): Promise<T> {
        const data = { ...value } as T;

        if (!data.id) {
            data.id = this.uuid();
        }

        const store = await this.transaction(this.tableName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    }

    async update(id: string, value: Partial<T>): Promise<T> {
        if (!id) {
            return Promise.reject(new Error('ID is required'));
        }

        const existing = await this.get(id);
        if (!existing) {
            return Promise.reject(new Error('Entity not found'));
        }

        const newData = merge(cloneDeep(existing), value) as T;

        const store = await this.transaction(this.tableName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(newData);
            request.onsuccess = () => resolve(newData);
            request.onerror = () => reject(request.error);
        });
    }

    async remove(id: string): Promise<string> {
        const store = await this.transaction(this.tableName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(id);
            request.onerror = () => reject(request.error);
        });
    }

    async removeBy(args: IWhere): Promise<void> {
        const data = await this.select({ where: args });
        const store = await this.transaction(this.tableName, 'readwrite');

        await Promise.all(
            data.map(item => {
                return new Promise<void>((resolve, reject) => {
                    const request = store.delete(item.id);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            }),
        );
    }

    async count(args?: Partial<IQuery>): Promise<number> {
        const data = await this.select(args);
        return data.length;
    }

    async sum(field: keyof T, args?: Partial<IQuery>): Promise<number> {
        const data = await this.select(args);
        return data.reduce((acc, item) => acc + ((item[field] as number) || 0), 0);
    }

    uuid() {
        return uuid();
    }

    async setTableName(tableName: string): Promise<void> {
        this.tableName = tableName;
    }

    async setRootCollection(rootCollection: string): Promise<void> {
        this.rootCollection = rootCollection;
        await this.setTableName(`${rootCollection}/${this.tableName}`);
    }

    async removeRootCollection(): Promise<void> {
        this.rootCollection = undefined;
        await this.setTableName(this.tableName); // Reset table name without rootCollection
    }
}
