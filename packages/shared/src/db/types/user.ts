import { type IBaseDB } from './common';
import { type ROLES } from '../enum';

export interface IUserDB extends Omit<IBaseDB, 'organizationId'> {
    email: string;
    roles: ROLES[];
    organizationId: string | null;
}
