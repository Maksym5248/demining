import { type Dayjs } from 'dayjs';
import { type IUserAccessDB } from 'shared-my';

import { type IUpdateUserDTO, type IUserDTO } from '~/api';
import { dates } from '~/common';

export type IUpdateUserParams = IUpdateUserDTO;

export interface IUserData {
    id: string;
    info: {
        name?: string | null;
        photoUri?: string | null;
    };
    access?: Partial<IUserAccessDB>;
    member?: {
        organizationId: string | null;
    };
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createUser = (value: IUserDTO): IUserData => ({
    id: value.id,
    info: {
        photoUri: value?.info?.photoUri ?? '',
    },
    access: { ...(value?.access ?? {}) },
    member: {
        organizationId: value?.member?.organizationId ?? null,
    },
    createdAt: dates.fromServerDate(value.info?.createdAt),
    updatedAt: dates.fromServerDate(value.info?.updatedAt),
});
