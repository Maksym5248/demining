import { Dayjs } from 'dayjs';

import { IUserDTO } from '~/api';
import { ROLES } from '~/constants';
import { dates } from '~/utils';

export interface IUserValue {
    id: string;
    email: string;
    roles: ROLES[];
    organizationId: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createUser = (value: IUserDTO): IUserValue => ({
    id: value.id,
    email: value?.email ?? '',
    roles: value?.roles ?? [],
    organizationId: value?.organizationId ?? '',
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export class UserValue implements IUserValue {
    public id: string;
    public email: string;
    public roles: ROLES[];
    public organizationId: string;
    public createdAt: Dayjs;
    public updatedAt: Dayjs;

    constructor(value: IUserValue) {
        this.id = value.id;
        this.email = value.email;
        this.roles = value.roles;
        this.organizationId = value.organizationId;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
