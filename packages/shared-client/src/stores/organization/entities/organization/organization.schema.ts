import { type Dayjs } from 'dayjs';

import { type ICreateOrganizationDTO, type IOrganizationDTO } from '~/api';
import { dates } from '~/common';

export interface IOrganizationValue {
    id: string;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export type IUpdateOrganizationParams = Pick<IOrganizationValue, 'name'>;

export const createOrganization = (value: Omit<IOrganizationDTO, 'members'>): IOrganizationValue => ({
    id: value.id,
    name: value?.name ?? '',
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createOrganizationDTO = (value: ICreateOrganizationDTO): ICreateOrganizationDTO => ({
    name: value?.name ?? '',
});
