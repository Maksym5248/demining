import { Dayjs } from 'dayjs';

import { ICreateOrganizationDTO, ICreateOrganizationMembersDTO, IOrganizationDTO } from '~/api';
import { dates } from '~/utils';

export interface IOrganizationValue {
    id: string;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createOrganization = (
    value: Omit<IOrganizationDTO, 'members'>,
): IOrganizationValue => ({
    id: value.id,
    name: value?.name ?? '',
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createOrganizationDTO = (value: ICreateOrganizationDTO): ICreateOrganizationDTO => ({
    name: value?.name ?? '',
});

export const createMembersDTO = (value: string[]): ICreateOrganizationMembersDTO => ({
    membersIds: value ?? [],
});
