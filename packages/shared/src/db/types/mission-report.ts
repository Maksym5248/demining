import { type IAddressDB, type IBaseDB, type Timestamp } from './common';

export interface IMissionReportDB extends IBaseDB {
    approvedAt: Timestamp;
    number: number;
    subNumber: number | null;
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | null;
    depthExamination: number | null;
    uncheckedTerritory: number | null;
    uncheckedReason: string | null;
    workStart: Timestamp;
    exclusionStart: Timestamp | null;
    transportingStart: Timestamp | null;
    destroyedStart: Timestamp | null;
    workEnd: Timestamp;
    address: string;
    addressDetails?: IAddressDB;
    authorId: string;
}
