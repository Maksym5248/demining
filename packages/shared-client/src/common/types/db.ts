import { type DocumentChangeType } from '@firebase/firestore-types';
import {
    type IOrganizationDB,
    type IBaseDB,
    type Timestamp,
    type IExplosiveObjectDB,
    type IExplosiveDeviceDB,
    type IEmployeeDB,
    type IEmployeeActionDB,
    type IMapViewActionDB,
    type IMissionReportDB,
    type IMissionRequestDB,
    type IOrderDB,
    type IExplosiveObjectActionDB,
    type ITransportDB,
    type ITransportActionDB,
    type IEquipmentDB,
    type IEquipmentActionDB,
    type IDocumentDB,
    type IExplosiveDeviceActionDB,
    type IUserDB,
    type IExplosiveDB,
    type IExplosiveObjectTypeDB,
    type IExplosiveObjectClassDB,
    type IExplosiveObjectClassItemDB,
} from 'shared-my';

export type IWhere = { [field: string]: any };
export type IQueryOrder = {
    by: string;
    type?: 'asc' | 'desc';
};

export type IQuery = {
    or?: IWhere[];
    search?: string;
    where?: IWhere;
    order?: IQueryOrder;
    limit?: number;
    startAfter?: string | number | Timestamp;
    startAt?: string | number | Timestamp;
    endAt?: string | number | Timestamp;
};

export type IDocumentChangeType = DocumentChangeType;
export interface ISubscriptionDocument<T> {
    type: IDocumentChangeType;
    newIndex: number;
    oldIndex: number;
    data: T;
}
export type ICreateData<T extends IBaseDB> = Omit<T, 'createdAt' | 'updatedAt' | 'authorId' | 'id' | 'geo'> & Partial<Pick<T, 'id'>>;

export interface IDBBase<T extends IBaseDB> {
    setRootCollection(rootCollection: string): void;
    removeRootCollection(): void;
    setBatch(batch: any): void;
    uuid(): string;
    select(args?: Partial<IQuery>): Promise<T[]>;
    get(id: string): Promise<T | null>;
    getByIds(ids: string[]): Promise<T[]>;
    exist(field: keyof T, value: any): Promise<boolean>;
    create(value: ICreateData<T>): Promise<T>;
    update(id: string, value: Partial<T>): Promise<T>;
    remove(id: string): Promise<string>;
    removeBy(args: IWhere): Promise<void>;
    batchCreate(value: ICreateData<T>): void;
    batchUpdate(id: string, value: Partial<T>): void;
    batchRemove(id: string): void;
    count(args?: Partial<IQuery>): Promise<number>;
    sum(field: keyof T, args?: Partial<IQuery>): Promise<number>;
    subscribe(args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<T>[]) => void): Promise<void>;
}

export interface IDB {
    user: IDBBase<IUserDB>;
    organization: IDBBase<IOrganizationDB>;
    explosiveObject: IDBBase<IExplosiveObjectDB>;
    explosiveObjectAction: IDBBase<IExplosiveObjectActionDB>;
    explosiveObjectType: IDBBase<IExplosiveObjectTypeDB>;
    explosiveObjectClass: IDBBase<IExplosiveObjectClassDB>;
    explosiveObjectClassItem: IDBBase<IExplosiveObjectClassItemDB>;
    explosiveDevice: IDBBase<IExplosiveDeviceDB>;
    explosive: IDBBase<IExplosiveDB>;
    employee: IDBBase<IEmployeeDB>;
    employeeAction: IDBBase<IEmployeeActionDB>;
    mapViewAction: IDBBase<IMapViewActionDB>;
    missionReport: IDBBase<IMissionReportDB>;
    missionRequest: IDBBase<IMissionRequestDB>;
    order: IDBBase<IOrderDB>;
    transport: IDBBase<ITransportDB>;
    transportAction: IDBBase<ITransportActionDB>;
    equipment: IDBBase<IEquipmentDB>;
    equipmentAction: IDBBase<IEquipmentActionDB>;
    document: IDBBase<IDocumentDB>;
    book: IDBBase<IBaseDB>;
    explosiveDeviceAction: IDBBase<IExplosiveDeviceActionDB>;
    batchStart(): void;
    batchCommit(): Promise<void>;
    init(): void;
    dropDb(): void;
    setOrganizationId(id: string): void;
    removeOrganizationId(): void;
}
