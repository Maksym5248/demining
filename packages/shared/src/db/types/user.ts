import { type IBaseDB } from './common';
import { type ROLES } from '../enum';

/**
 * Collection to manage user permission
 */
export interface IMemberDB extends Omit<IBaseDB, 'organizationId'> {
    organizationId: string | null;
}

/**
 * User can't edit this information
 * id the same as uid
 */
export interface IUserAccessDB extends Omit<IBaseDB, 'organizationId'>, Partial<Record<ROLES, boolean>> {}

/**
 * User can edit this information
 */
export interface IUserInfoDB extends Omit<IBaseDB, 'organizationId'> {
    photoUri: string | null;
    name: string | null;
}
