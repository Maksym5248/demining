import { type Dayjs } from 'dayjs';
import { type ROLES } from 'shared-my';

import { type ICurrentUserDTO, type IUserOrganizationDTO } from '~/api';
import { dates } from '~/common';

export interface ICurrentUserOrganizationValue {
    id: string;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface ICurrentUserData {
    id: string;
    info: {
        email: string;
    };
    access: Partial<Record<ROLES, boolean>>;
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

export const createCurrentUser = (value: ICurrentUserDTO): ICurrentUserData => ({
    id: value.id,
    info: {
        email: value.info?.email ?? '',
    },
    access: {
        ...value?.access,
    },
    createdAt: dates.fromServerDate(value.info?.createdAt),
    updatedAt: dates.fromServerDate(value.info?.updatedAt),
    organization: value?.organization ? createCurrentUserOrganization(value.organization) : null,
});
