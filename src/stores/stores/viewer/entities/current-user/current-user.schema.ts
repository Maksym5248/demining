import { Dayjs } from 'dayjs';

import { ROLES } from '~/constants';
import { IUserDTO } from '~/api';
import { dates } from '~/utils';

interface IUserValue {
	id: string;
    roles: ROLES[];
    organizationId: string | null;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createCurrentUser = (value: IUserDTO): IUserValue => ({
	id: value.id,
	roles: value?.roles ?? [],
	organizationId: value?.organizationId,
	createdAt: dates.create(value.createdAt),
	updatedAt: dates.create(value.updatedAt),
});
