import { type Dayjs } from 'dayjs';
import { EMPLOYEE_TYPE } from 'shared-my/db';

import { type IEmployeeDTO } from '~/api';
import { dates, data, type ICreateValue } from '~/common';

export interface IEmployeeValue {
    id: string;
    type: EMPLOYEE_TYPE;
    firstName: string;
    lastName: string;
    surname: string;
    rankId: string;
    position: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createEmployeeDTO = (value: ICreateValue<IEmployeeValue>): ICreateValue<IEmployeeDTO> => ({
    type: value?.type ?? null,
    firstName: String(value?.firstName) ?? '',
    lastName: String(value?.lastName) ?? '',
    surname: String(value?.surname) ?? '',
    rankId: value?.rankId ?? '',
    position: value?.position ?? '',
});

export const updateEmployeeDTO = data.createUpdateDTO<IEmployeeValue, IEmployeeDTO>((value) => ({
    type: value?.type ?? EMPLOYEE_TYPE.WORKER,
    firstName: String(value?.firstName) ?? '',
    lastName: String(value?.lastName) ?? '',
    surname: String(value?.surname) ?? '',
    rankId: value?.rankId ?? '',
    position: value?.position ?? '',
}));

export const createEmployee = (employee: IEmployeeDTO): IEmployeeValue => ({
    id: employee.id,
    type: employee.type || EMPLOYEE_TYPE.WORKER,
    firstName: String(employee.firstName) || '',
    lastName: String(employee.lastName) || '',
    surname: String(employee.surname) || '',
    rankId: employee.rankId,
    position: employee.position || '',
    createdAt: dates.fromServerDate(employee.createdAt),
    updatedAt: dates.fromServerDate(employee.updatedAt),
});

export class EmployeeValue {
    id: string;
    type: EMPLOYEE_TYPE;
    firstName: string;
    lastName: string;
    surname: string;
    rankId: string;
    position: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: IEmployeeValue) {
        this.id = value.id;
        this.type = value.type;
        this.firstName = value.firstName;
        this.lastName = value.lastName;
        this.surname = value.surname;
        this.rankId = value.rankId;
        this.position = value.position;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
