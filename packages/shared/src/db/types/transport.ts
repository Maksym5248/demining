import { type IBaseDB, type ILinkedToDocumentDB } from './common';
import { type TRANSPORT_TYPE } from '../enum';

export interface ITransportDB extends IBaseDB {
    name: string;
    number: string;
    type: TRANSPORT_TYPE;
    authorId: string;
}

export interface ITransportActionDB extends ITransportDB, ILinkedToDocumentDB {
    transportId: string;
}
