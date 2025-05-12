import { merge } from 'lodash';
import { cloneDeep, type IBaseDB } from 'shared-my';
import { type IQuery, type IDBBase, type ICreateData, type IWhere } from 'shared-my-client';
import { v4 as uuid } from 'uuid';

import { limit, order, where } from './utils';

export class DBBase<T extends IBaseDB> implements IDBBase<T> {
    tableName: string;
    rootCollection?: string;
    dbName: string;
    private dbConnection?: IDBDatabase; // Store the database connection

    constructor(tableName: string, dbName = 'AppDatabase') {
        this.tableName = tableName;
        this.dbName = dbName;
    }

    private async openDB(): Promise<IDBDatabase> {
        if (this.dbConnection) {
            return this.dbConnection; // Reuse existing connection
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(this.tableName)) {
                    db.createObjectStore(this.tableName, { keyPath: 'id' });
                }
            };

            request.onsuccess = () => {
                this.dbConnection = request.result; // Cache the connection
                resolve(this.dbConnection);
            };

            request.onerror = () => reject(request.error);
        });
    }

    private async transaction(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.openDB();
        const transaction = db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }

    async closeDB(): Promise<void> {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = undefined; // Clear the cached connection
        }
    }

    async select(args?: Partial<IQuery>): Promise<T[]> {
        const store = await this.transaction(this.tableName, 'readonly');
        const data: T[] = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as T[]);
            request.onerror = () => reject(request.error);
        });

        const filtered = args?.where ? where(args, data) : data;
        const ordered = args?.order ? order(args, filtered) : filtered;
        const limited = args?.limit ? limit(args, ordered) : ordered;

        return limited;
    }

    async get(id: string): Promise<T | null> {
        const store = await this.transaction(this.tableName, 'readonly');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result || null);
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

        const db = await this.openDB();
        if (!db.objectStoreNames.contains(this.tableName)) {
            db.close();
            await new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, db.version + 1);
                request.onupgradeneeded = () => {
                    const upgradeDb = request.result;
                    upgradeDb.createObjectStore(this.tableName, { keyPath: 'id' });
                };
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
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
