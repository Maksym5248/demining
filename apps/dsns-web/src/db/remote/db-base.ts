import { removeFields } from '@/shared/common';
import { type IBaseDB } from '@/shared/db';
import { type IWhere, type IQuery, type IOrder, type IDBBase, type ICreateData } from '@/shared-client/common';
import {
    getFirestore,
    collection,
    type CollectionReference,
    doc,
    getDoc,
    query,
    where,
    deleteDoc,
    getDocs,
    setDoc,
    serverTimestamp,
    type Timestamp,
    updateDoc,
    type UpdateData,
    orderBy,
    limit,
    type WriteBatch,
    startAfter,
    getCountFromServer,
    getAggregateFromServer,
    sum,
    type QueryFieldFilterConstraint,
    startAt,
    endAt,
} from 'firebase/firestore';
import { isObject } from 'lodash';
import isArray from 'lodash/isArray';

function generateValueStartsWith(value: string): string[] {
    const prefixes: string[] = [];
    const arr = value.toLowerCase().split(/\s+/);

    arr.forEach((v) => {
        for (let i = 1; i <= v.length; i += 1) {
            prefixes.push(v.substring(0, i));
        }
    });

    return prefixes;
}

const getWhere = (values: IWhere) => {
    const res: QueryFieldFilterConstraint[] = [];

    Object.keys(values).forEach((key) => {
        const value = values[key];

        if (value?.in && isArray(value.in)) {
            res.push(where(key, 'in', value.in));
        }

        if (value?.['>=']) {
            res.push(where(key, '>=', value['>=']));
        }

        if (value?.['<=']) {
            res.push(where(key, '<=', value['<=']));
        }

        if (!!value && value['array-contains-any']) {
            res.push(where(key, 'array-contains-any', value['array-contains-any']));
        }

        if (!isObject(value) && !isArray(value)) {
            res.push(where(key, '==', value));
        }
    });

    return res;
};

const getOrder = (value: IOrder) => orderBy(value.by, value.type);

export class DBBase<T extends IBaseDB> implements IDBBase<T> {
    tableName: string;

    rootCollection?: string;

    batch: WriteBatch | null = null;

    searchFields: (keyof T)[];

    getCreateData: ((value: Omit<T, 'createdAt' | 'updatedAt' | 'authorId' | 'id' | 'geo'>) => Partial<T>) | undefined = undefined;

    getUpdateData: ((value: Partial<T>) => Partial<T>) | undefined = undefined;

    getSearchData: undefined | ((value: Partial<T>) => string[]) = undefined;

    constructor(
        tableName: string,
        searchFields: (keyof T)[],
        getCreateData?: (value: Omit<T, 'createdAt' | 'updatedAt' | 'authorId' | 'id' | 'geo'>) => Partial<T>,
        getUpdateData?: (value: Partial<T>) => Partial<T>,
        getSearchData?: (value: Partial<T>) => string[],
    ) {
        this.tableName = tableName;
        this.searchFields = searchFields ?? [];
        this.getCreateData = getCreateData;
        this.getUpdateData = getUpdateData;
        this.getSearchData = getSearchData;
    }

    setRootCollection(rootCollection: string) {
        this.rootCollection = rootCollection;
    }

    removeRootCollection() {
        this.rootCollection = undefined;
    }

    setBatch(batch: WriteBatch | null) {
        this.batch = batch;
    }

    get collection() {
        const name = this.rootCollection ? `${this.rootCollection}/${this.tableName}` : this.tableName;
        return collection(getFirestore(), name) as CollectionReference<T>;
    }

    uuid() {
        const newDocumentRef = doc(this.collection);
        return newDocumentRef.id;
    }

    query(args?: Partial<IQuery>) {
        return query(
            this.collection,
            ...(args?.search ? getWhere(this.createSearchWhere(args?.search)) : []),
            ...(args?.where ? getWhere(args.where) : []),
            ...(args?.order ? [getOrder(args?.order)] : []),
            ...(args?.startAfter ? [startAfter(args?.startAfter)] : []),
            ...(args?.startAt ? [startAt(args?.startAt)] : []),
            ...(args?.endAt ? [endAt(args?.endAt)] : []),
            ...(args?.limit ? [limit(args?.limit)] : []),
        );
    }

    async select(args?: Partial<IQuery>): Promise<T[]> {
        const q = this.query(args);

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((d) => {
            const newData = d.data();
            removeFields(newData, '_search');
            return newData;
        }) as (T & {
            createdAt: Timestamp;
            updatedAt: Timestamp;
            _search: Record<keyof T, string>;
        })[];

        return data as T[];
    }

    async get(id: string): Promise<T | null> {
        const ref = doc(this.collection, id);

        const res = await getDoc(ref);

        if (!res) return null;
        if (!res?.exists()) return null;

        const data = res.data() as T & {
            createdAt: Timestamp;
            updatedAt: Timestamp;
            _search: Record<keyof T, string>;
        };

        // @ts-expect-error
        if (data?._search) delete data._search;

        return data;
    }

    async exist(field: keyof T, value: any): Promise<boolean> {
        const q = query(this.collection, where(String(field), '==', value));

        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty;
    }

    private createSearchField(value: Partial<T>) {
        const _search: string[] = [];

        this.searchFields.forEach((field) => {
            const arr = generateValueStartsWith(String(value[field] ?? ''));
            _search.push(...arr);
        });

        if (this.getSearchData) {
            const values = this.getSearchData(value);

            values.forEach((v) => {
                const arr = generateValueStartsWith(v);
                _search.push(...arr);
            });
        }

        return { _search };
    }

    private createSearchWhere(search: string) {
        const searchLower = String(search ?? '')
            .toLowerCase()
            .split(/\s+/);

        const _search = {
            'array-contains-any': searchLower,
        };

        return { _search };
    }

    private getICreateValue(value: ICreateData<T>) {
        const id = value?.id ?? this.uuid();
        const ref = doc(this.collection, id);
        const timestamp = serverTimestamp();
        const search = this.createSearchField(value as T);

        const createData = this.getCreateData ? this.getCreateData(value) : {};

        const newValue = {
            ...search,
            ...value,
            id,
            ...createData,
            createdAt: timestamp,
            updatedAt: timestamp,
        } as T & {
            createdAt: Timestamp;
            updatedAt: Timestamp;
            _search: string[];
        };

        return { ref, newValue };
    }

    private getUpdateValue(id: string, value: Partial<T>) {
        const newValue = { ...value };
        const search = this.createSearchField(value as T);

        if (newValue?.id) delete newValue.id;
        if (newValue?.updatedAt) delete newValue.updatedAt;
        if (newValue?.createdAt) delete newValue.createdAt;

        const ref = doc(this.collection, id);
        const timestamp = serverTimestamp();

        const updateData = this.getUpdateData ? this.getUpdateData(value) : {};

        const updatedValue = {
            ...search,
            ...newValue,
            ...updateData,
            updatedAt: timestamp,
        } as UpdateData<T>;

        return { ref, newValue: updatedValue };
    }

    async create(value: ICreateData<T>): Promise<T> {
        const { ref, newValue } = this.getICreateValue(value);

        await setDoc(ref, newValue);
        const res = (await this.get(newValue.id)) as T;
        return res;
    }

    batchCreate(value: ICreateData<T>) {
        const { ref, newValue } = this.getICreateValue(value);
        this.batch?.set(ref, newValue);
    }

    async update(id: string, value: Partial<T>): Promise<T> {
        const { ref, newValue } = this.getUpdateValue(id, value);
        await updateDoc(ref, newValue);
        const res = (await this.get(id)) as T;
        return res;
    }

    batchUpdate(id: string, value: Partial<T>) {
        const { ref, newValue } = this.getUpdateValue(id, value);
        this.batch?.update(ref, newValue);
    }

    async remove(id: string) {
        const ref = doc(this.collection, id);
        await deleteDoc(ref);
        return id;
    }

    batchRemove(id: string) {
        const ref = doc(this.collection, id);
        this.batch?.delete(ref);
    }

    async count(args?: Partial<IQuery>) {
        const q = this.query(args);

        const snapshot = await getCountFromServer(q);

        return snapshot.data().count;
    }

    async sum(field: keyof T, args?: Partial<IQuery>) {
        const q = this.query(args);

        const snapshot = await getAggregateFromServer(q, {
            sum: sum(field as string),
        });

        return snapshot.data().sum;
    }

    async removeBy(args: IWhere) {
        const q = query(this.collection, ...getWhere(args));

        const querySnapshot = await getDocs(q);
        const deletePromises: Promise<any>[] = [];

        querySnapshot.forEach((d) => {
            deletePromises.push(deleteDoc(d.ref));
        });

        await Promise.all(deletePromises);
    }
}
