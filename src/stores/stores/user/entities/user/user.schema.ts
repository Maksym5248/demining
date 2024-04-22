import { Dayjs } from 'dayjs';

import { ROLES } from '~/constants';
import { IUserDTO } from '~/api';
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
	email: value?.email ?? "",
	roles: value?.roles ?? [],
	organizationId: value?.organizationId ?? "",
	createdAt: dates.fromServerDate(value.createdAt),
	updatedAt: dates.fromServerDate(value.updatedAt),
});