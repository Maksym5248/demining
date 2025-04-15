import { type IBaseDB } from './common';

export interface IOrganizationDB extends IBaseDB {
    name: string;
    membersIds: string[];
    authorId: string;
}
