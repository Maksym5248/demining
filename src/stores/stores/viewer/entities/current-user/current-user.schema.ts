import { Dayjs } from 'dayjs';

import { ROLES } from '~/constants';
import { ICurrentUserDTO, IUserOrganizationDTO } from '~/api';
import { dates } from '~/utils';

interface IUserOrganizationValue {
	id: string;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

interface IUserValue {
	id: string;
    roles: ROLES[];
	email: string;
    organization: IUserOrganizationValue | null;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createUserOrganization = (value: IUserOrganizationDTO): IUserOrganizationValue => ({
	id: value.id,
	name: value.name ?? "",
	createdAt: dates.fromServerDate(value.createdAt),
	updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createCurrentUser = (value: ICurrentUserDTO): IUserValue => ({
	id: value.id,
	roles: value?.roles ?? [],
	email: value.email ?? "",
	organization: value?.organization ? createUserOrganization(value.organization) : null,
	createdAt: dates.fromServerDate(value.createdAt),
	updatedAt: dates.fromServerDate(value.updatedAt),
});
