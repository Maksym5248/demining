import { ROLES } from '@/shared';
import { Dayjs } from 'dayjs';

import { ICurrentUserDTO, IUserOrganizationDTO } from '~/api';
import { dates } from '~/utils';

export interface IUserOrganizationValue {
    id: string;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IUserValue {
    id: string;
    roles: ROLES[];
    email: string;
    organization: IUserOrganizationValue | null;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createUserOrganization = (value: IUserOrganizationDTO): IUserOrganizationValue => ({
    id: value.id,
    name: value.name ?? '',
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createUser = (value: ICurrentUserDTO): IUserValue => ({
    id: value.id,
    roles: value?.roles ?? [],
    email: value.email ?? '',
    organization: value?.organization ? createUserOrganization(value.organization) : null,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export class UserValue {
    id: string;
    roles: ROLES[];
    email: string;
    organization: IUserOrganizationValue | null;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: IUserValue) {
        this.id = value.id;
        this.roles = value.roles;
        this.email = value.email;
        this.organization = value.organization;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
