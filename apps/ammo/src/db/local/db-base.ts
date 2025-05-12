import { merge } from 'lodash';
import { MMKV } from 'react-native-mmkv';
import { cloneDeep, type IBaseDB } from 'shared-my';
import { type IQuery, type ICreateData, type IWhere, type IDBLocal } from 'shared-my-client';
import { v4 as uuid } from 'uuid';

import { convertTimestamps, limit, order, where } from './utils';

export class DBBase<T extends IBaseDB> implements IDBLocal<T> {
    tableName: string;
    rootCollection?: string;
    storage: MMKV;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.storage = new MMKV({ id: this.key });
    }

    drop(): void {
        this.storage.clearAll();
    }

    createStorage() {
        this.storage = new MMKV({ id: this.key });
    }

    setTableName(tableName: string) {
        this.tableName = tableName;
        this.createStorage();
    }

    setRootCollection(rootCollection: string) {
        this.rootCollection = rootCollection;
        this.createStorage();
    }

    removeRootCollection() {
        this.rootCollection = undefined;
        this.createStorage();
    }

    private filter(args?: Partial<IQuery>): T[] {
        const data = this.storage
            .getAllKeys()
            .filter(key => key.startsWith(`${this.key}-entity/`))
            .map(key => this.entityLoad(key))
            .filter(Boolean) as T[];

        const filtered = args?.where ? where(args, data) : data;
        const ordered = args?.order ? order(args, filtered) : data;
        const limited = args?.limit ? limit(args, ordered) : ordered;

        return limited;
    }

    private get key() {
        const name = this.rootCollection ? `${this.rootCollection}/${this.tableName}` : this.tableName;
        return name;
    }

    private get keyEntity() {
        return `${this.key}-query`;
    }

    private getEntityKey(id: string) {
        return `${this.keyEntity}/${id}`;
    }

    private entityLoad(id: string): T | null {
        const key = this.getEntityKey(id);
        const data = this.storage.getString(key);
        if (!data) return null;

        const parsedData = JSON.parse(data);

        return convertTimestamps(parsedData);
    }

    private entityUpload(id: string, value: T) {
        const key = this.getEntityKey(id);
        this.storage.set(key, JSON.stringify(value));
    }

    uuid() {
        return uuid();
    }

    select(args?: Partial<IQuery>): Promise<T[]> {
        const data = this.filter(args);
        return Promise.resolve(data);
    }

    get(id: string): Promise<T | null> {
        const data = this.entityLoad(id);
        return Promise.resolve(data);
    }

    getByIds(ids: string[]): Promise<T[]> {
        const data = ids.map(id => this.entityLoad(id)).filter(Boolean) as T[];
        return Promise.resolve(data);
    }

    exist(field: keyof T, value: any): Promise<boolean> {
        if (field === 'id') {
            const data = this.entityLoad(value);
            return Promise.resolve(!!data);
        } else {
            const data = this.select({ where: { [field]: value }, limit: 1 });
            return Promise.resolve(!!data);
        }
    }

    create(value: ICreateData<T>): Promise<T> {
        const data = { ...value } as T;

        if (!data.id) {
            data.id = this.uuid();
        }

        this.entityUpload(data.id, data);
        return Promise.resolve(data);
    }

    update(id: string, value: Partial<T>): Promise<T> {
        if (!id) {
            return Promise.reject(new Error('ID is required'));
        }

        const data = this.entityLoad(id);
        const newData = merge(cloneDeep(data), value) as T;

        this.entityUpload(id, newData);

        return Promise.resolve(newData);
    }

    remove(id: string): Promise<string> {
        const key = this.getEntityKey(id);
        this.storage.delete(key);

        return Promise.resolve(id);
    }

    removeBy(args: IWhere): Promise<void> {
        const data = this.filter({ where: args });

        data.forEach(item => {
            const key = this.getEntityKey(item.id);
            this.storage.delete(key);
        });

        return Promise.resolve();
    }

    count(args?: Partial<IQuery>): Promise<number> {
        const data = this.filter(args);
        return Promise.resolve(data.length);
    }

    sum(field: keyof T, args?: Partial<IQuery>): Promise<number> {
        const data = this.filter(args);
        const sum = data.reduce((acc, item) => acc + ((item[field] as number) || 0), 0);
        return Promise.resolve(sum);
    }
}
