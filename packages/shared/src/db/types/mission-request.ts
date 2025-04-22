import { type IBaseDB, type Timestamp } from './common';
import { type MISSION_REQUEST_TYPE } from '../enum';

export interface IMissionRequestTypeDB {
    id: MISSION_REQUEST_TYPE;
    name: string;
}

export interface IMissionRequestDB extends IBaseDB {
    signedAt: Timestamp;
    number: string;
    authorId: string;
    type?: MISSION_REQUEST_TYPE;
}
