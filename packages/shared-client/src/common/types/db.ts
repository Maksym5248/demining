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
    type IExplosiveDB,
    type IExplosiveObjectTypeDB,
    type IExplosiveObjectClassDB,
    type IExplosiveObjectClassItemDB,
    type IExplosiveObjectDetailsDB,
    type IAppConfigDB,
    type IUserAccessDB,
    type IUserInfoDB,
    type IMemberDB,
    type IBookTypeDB,
    type ICountryDB,
    type IExplosiveDeviceTypeDB,
    type IExplosiveObjectComponentDB,
    type IMaterialDB,
    type IMissionRequestTypeDB,
    type IRankDB,
    type IStatusDB,
    type ICommentDB,
    type IComplainDB,
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
    setTableName(tableName: string): void;
    setRootCollection(rootCollection: string): void;
    removeRootCollection(): void;
    uuid(): string;
    select(args?: Partial<IQuery>): Promise<T[]>;
    get(id: string): Promise<T | null>;
    getByIds(ids: string[]): Promise<T[]>;
    exist(field: keyof T, value: any): Promise<boolean>;
    create(value: ICreateData<T>): Promise<T>;
    update(id: string, value: Partial<T>): Promise<T>;
    remove(id: string): Promise<string>;
    removeBy(args: IWhere): Promise<void>;
    count(args?: Partial<IQuery>): Promise<number>;
    sum(field: keyof T, args?: Partial<IQuery>): Promise<number>;
}

export interface IDBLocal<T extends IBaseDB> extends IDBBase<T> {
    drop(): void;
}
export interface IDBRemote<T extends IBaseDB> extends IDBBase<T> {
    setBatch(batch: any): void;
    exist(field: keyof T, value: any): Promise<boolean>;
    batchCreate(value: ICreateData<T>): void;
    batchUpdate(id: string, value: Partial<T>): void;
    batchRemove(id: string): void;
    subscribe(args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<T>[]) => void): Promise<void>;
}

export interface IDB {
    userInfo: IDBBase<IUserInfoDB>;
    userAccess: IDBBase<IUserAccessDB>;
    member: IDBBase<IMemberDB>;

    organization: IDBBase<IOrganizationDB>;
    explosiveObject: IDBBase<IExplosiveObjectDB>;
    explosiveObjectDetails: IDBBase<IExplosiveObjectDetailsDB>;
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
    app: IDBBase<IAppConfigDB>;
    comment: IDBBase<ICommentDB>;
    complain: IDBBase<IComplainDB>;

    // with enums
    bookType: IDBBase<IBookTypeDB>;
    country: IDBBase<ICountryDB>;
    explosiveDeviceType: IDBBase<IExplosiveDeviceTypeDB>;
    explosiveObjectComponent: IDBBase<IExplosiveObjectComponentDB>;
    material: IDBBase<IMaterialDB>;
    missionRequestType: IDBBase<IMissionRequestTypeDB>;
    rank: IDBBase<IRankDB>;
    status: IDBBase<IStatusDB>;

    batchStart(): void;
    batchCommit(): Promise<void>;
    init(): void;
    drop(): void;
    setOrganizationId(id: string): void;
    removeOrganizationId(): void;
    setLang(lang: 'uk' | 'en'): void;
}
