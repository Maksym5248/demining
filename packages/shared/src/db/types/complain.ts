import { type IBaseDB } from './common';
import { type COMPLAIN_TYPE } from '../enum/entities/complain';

export interface IComplainDB extends Omit<IBaseDB, 'organizationId'> {
    text: string;
    type: COMPLAIN_TYPE;
    entityId: string;
    authorId: string;
}
