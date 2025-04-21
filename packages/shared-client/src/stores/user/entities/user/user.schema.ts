import { type Dayjs } from 'dayjs';
import { type ROLES } from 'shared-my';

import { type IUpdateUserDTO, type IUserDTO } from '~/api';
import { data, dates } from '~/common';

export type IUpdateUserParams = IUpdateUserDTO;

export interface IUserData {
    id: string;
    info: {
        email: string;
    };
    access: Partial<Record<ROLES, boolean>>;
    member: {
        organizationId: string | null;
    };
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createUser = (value: IUserDTO): IUserData => ({
    id: value.id,
    info: {
        email: value?.info?.email ?? '',
    },
    access: { ...(value?.access ?? {}) },
    member: {
        organizationId: value?.member.organizationId ?? null,
    },
    createdAt: dates.fromServerDate(value.info?.createdAt),
    updatedAt: dates.fromServerDate(value.info?.updatedAt),
});

export const updateUserDTO = data.createUpdateDTO<IUpdateUserParams, IUpdateUserDTO>(value => ({
    info: value?.info
        ? {
              email: value?.info?.email ?? '',
          }
        : undefined,
    access: value?.access ? { ...value?.access } : undefined,
    member: value?.member
        ? {
              organizationId: value?.member.organizationId ?? null,
          }
        : undefined,
}));
