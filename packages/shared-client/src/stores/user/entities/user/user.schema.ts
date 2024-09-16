import { type Dayjs } from 'dayjs';
import { type ROLES } from 'shared-my';

import { type IUserDTO } from '~/api';
import { dates } from '~/common';

export interface IUserData {
    id: string;
    email: string;
    roles: ROLES[];
    organizationId: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createUser = (value: IUserDTO): IUserData => ({
    id: value.id,
    email: value?.email ?? '',
    roles: value?.roles ?? [],
    organizationId: value?.organizationId ?? '',
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
