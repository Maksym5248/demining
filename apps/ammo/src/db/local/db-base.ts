import { MMKV } from 'react-native-mmkv';
import { type Timestamp, type IBaseDB, path } from 'shared-my';
import { type IQuery, type IDBBase, type ICreateData, type IWhere, dates, type Path } from 'shared-my-client';
import { v4 as uuid } from 'uuid';

import { getWhere } from './utils';

export class DBBase<T extends IBaseDB> implements IDBBase<T> {
    tableName: string;
    rootCollection?: string;
    storage: MMKV;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.storage = new MMKV({ id: this.key });
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
        const allData = this.storage
            .getAllKeys()
            .filter(key => key.startsWith(`${this.key}-entity/`))
            .map(key => this.entityLoad(key))
            .filter(Boolean) as T[];

        const filters = [...(args?.where ? getWhere(args.where) : [])];

        let filteredData = allData;

        // Apply filters
        if (filters.length) {
            filteredData = filteredData.filter(item => filters.every(filter => filter(item)));
        }

        // Apply order
        if (args?.order) {
            const { by, type } = args.order;

            filteredData.sort((a, b) => {
                const aValue = path(a, by as Path<T>) as string | number | Timestamp;
                const bValue = path(b, by as Path<T>) as string | number | Timestamp;

                let aComparable = aValue;
                let bComparable = bValue;

                // Check if values are Firestore Timestamps and convert them
                if (dates.isServerDate(aValue)) {
                    aComparable = dates.fromServerDate(aValue as Timestamp).valueOf();
                }
                if (dates.isServerDate(bValue)) {
                    bComparable = dates.fromServerDate(bValue as Timestamp).valueOf();
                }

                // Perform comparison
                if (aComparable < bComparable) return type === 'asc' ? -1 : 1;
                if (aComparable > bComparable) return type === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Apply limit
        if (args?.limit) {
            filteredData = filteredData.slice(0, args.limit);
        }

        return filteredData;
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
        return data ? JSON.parse(data) : null;
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
        const newData = {
            ...data,
            ...value,
        } as T;

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
