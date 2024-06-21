import { type Dayjs } from 'dayjs';

import { type ICreateOrganizationDTO, type ICreateOrganizationMembersDTO, type IOrganizationDTO } from '~/api';
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

export const createMembersDTO = (value: string[]): ICreateOrganizationMembersDTO => ({
    membersIds: value ?? [],
});

export class OrganizationValue {
    public id: string;
    public name: string;
    public createdAt: Dayjs;
    public updatedAt: Dayjs;

    constructor(value: IOrganizationValue) {
        this.id = value.id;
        this.name = value.name;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
