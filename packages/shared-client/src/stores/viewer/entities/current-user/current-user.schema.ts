import { type Dayjs } from 'dayjs';
import { type ROLES } from 'shared-my';

import { type IUserInfoDTO, type ICurrentUserDTO, type IUserOrganizationDTO } from '~/api';
import { dates } from '~/common';

export interface ICurrentUserOrganizationValue {
    id: string;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface ICurrentUserInfoUpdate {
    name: string;
    photoUri?: string | null;
}

export interface ICurrentUserInfoData extends Pick<IUserInfoDTO, 'email' | 'name' | 'photoUri'> {}
export interface ICurrentUserData {
    id: string;
    info: ICurrentUserInfoData;
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
        photoUri: value.info?.photoUri ?? null,
        name: value.info?.name ?? null,
    },
    access: {
        ...value?.access,
    },
    createdAt: dates.fromServerDate(value.info?.createdAt),
    updatedAt: dates.fromServerDate(value.info?.updatedAt),
    organization: value?.organization ? createCurrentUserOrganization(value.organization) : null,
});

export const createUpdateCurrentUserInfoDTO = (value: ICurrentUserInfoUpdate): ICurrentUserInfoUpdate => ({
    name: value?.name ?? '',
    photoUri: value?.photoUri ?? null,
});
