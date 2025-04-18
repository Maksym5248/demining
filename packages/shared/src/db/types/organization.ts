import { type IBaseDB } from './common';

export interface IOrganizationDB extends IBaseDB {
    name: string;
    authorId: string;
}
