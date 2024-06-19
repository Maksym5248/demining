import {
    type IOrganizationDB,
    type IBaseDB,
    type Timestamp,
    type IExplosiveObjectDB,
    type IExplosiveDB,
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
    type IExplosiveActionDB,
    type IUserDB,
} from '@/shared/db';

export type IWhere = { [field: string]: any };
export type IOrder = {
    by: string;
    type?: 'asc' | 'desc';
};

export type IQuery = {
    search?: string;
    where?: IWhere;
    order?: IOrder;
    limit?: number;
    startAfter?: string | number | Timestamp;
    startAt?: string | number | Timestamp;
    endAt?: string | number | Timestamp;
};

export type ICreateData<T extends IBaseDB> = Omit<T, 'createdAt' | 'updatedAt' | 'authorId' | 'id' | 'geo'> & Partial<Pick<T, 'id'>>;

export interface IDBBase<T extends IBaseDB> {
    setRootCollection(rootCollection: string): void;
    removeRootCollection(): void;
    setBatch(batch: unknown | null): void;
    uuid(): string;
    select(args?: Partial<IQuery>): Promise<T[]>;
    get(id: string): Promise<T | null>;
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
}

export interface IDB {
    user: IDBBase<IUserDB>;
    organization: IDBBase<IOrganizationDB>;
    explosiveObject: IDBBase<IExplosiveObjectDB>;
    explosive: IDBBase<IExplosiveDB>;
    employee: IDBBase<IEmployeeDB>;
    employeeAction: IDBBase<IEmployeeActionDB>;
    mapViewAction: IDBBase<IMapViewActionDB>;
    missionReport: IDBBase<IMissionReportDB>;
    missionRequest: IDBBase<IMissionRequestDB>;
    order: IDBBase<IOrderDB>;
    explosiveObjectAction: IDBBase<IExplosiveObjectActionDB>;
    transport: IDBBase<ITransportDB>;
    transportAction: IDBBase<ITransportActionDB>;
    equipment: IDBBase<IEquipmentDB>;
    equipmentAction: IDBBase<IEquipmentActionDB>;
    document: IDBBase<IDocumentDB>;
    explosiveAction: IDBBase<IExplosiveActionDB>;
    batchStart(): void;
    batchCommit(): Promise<void>;
    init(): void;
    dropDb(): void;
    setOrganizationId(id: string): void;
    removeOrganizationId(): void;
}
