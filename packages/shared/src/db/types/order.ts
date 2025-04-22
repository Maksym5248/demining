import { type IBaseDB, type Timestamp } from './common';

export interface IOrderDB extends IBaseDB {
    signedAt: Timestamp;
    number: number;
    authorId: string;
}
