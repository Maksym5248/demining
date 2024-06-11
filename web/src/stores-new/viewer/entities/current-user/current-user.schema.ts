import { ROLES } from '@/shared';
import { Dayjs } from 'dayjs';

import { ICurrentUserDTO, IUserOrganizationDTO } from '~/api';
import { dates } from '~/utils';

export interface ICurrentUserOrganizationValue {
    id: string;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface ICurrentUserValue {
    id: string;
    roles: ROLES[];
    email: string;
    organization: ICurrentUserOrganizationValue | null;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createCurrentUserOrganization = (value: IUserOrganizationDTO): ICurrentUserOrganizationValue => ({
    id: value.id,
    name: value.name ?? '',
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createCurrentUser = (value: ICurrentUserDTO): ICurrentUserValue => ({
    id: value.id,
    roles: value?.roles ?? [],
    email: value.email ?? '',
    organization: value?.organization ? createCurrentUserOrganization(value.organization) : null,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export class CurrentUserValue {
    id: string;
    roles: ROLES[];
    email: string;
    organization: ICurrentUserOrganizationValue | null;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: ICurrentUserValue) {
        this.id = value.id;
        this.roles = value.roles;
        this.email = value.email;
        this.organization = value.organization;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
