import { type IBaseDB } from './common';
import { type APPS, type ROLES } from '../enum';

export interface IUserDB extends Omit<IBaseDB, 'organizationId'> {
    email: string;
    roles: ROLES[];
    apps: APPS[];
    organizationId: string | null;
}
