import { type Dayjs } from 'dayjs';
import { EMPLOYEE_TYPE } from 'shared-my';

import { type IEmployeeDTO } from '~/api';
import { dates, data, type ICreateValue } from '~/common';

export interface IEmployeeData {
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

export const createEmployeeDTO = (value: ICreateValue<IEmployeeData>): ICreateValue<IEmployeeDTO> => ({
    type: value?.type ?? null,
    firstName: String(value?.firstName) ?? '',
    lastName: String(value?.lastName) ?? '',
    surname: String(value?.surname) ?? '',
    rankId: value?.rankId ?? '',
    position: value?.position ?? '',
});

export const updateEmployeeDTO = data.createUpdateDTO<IEmployeeData, IEmployeeDTO>((value) => ({
    type: value?.type ?? EMPLOYEE_TYPE.WORKER,
    firstName: String(value?.firstName) ?? '',
    lastName: String(value?.lastName) ?? '',
    surname: String(value?.surname) ?? '',
    rankId: value?.rankId ?? '',
    position: value?.position ?? '',
}));

export const createEmployee = (employee: IEmployeeDTO): IEmployeeData => ({
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
