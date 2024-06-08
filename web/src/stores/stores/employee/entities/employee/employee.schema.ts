import { Dayjs } from 'dayjs';

import { IEmployeeDTO } from '~/api';
import { EMPLOYEE_TYPE } from '~/constants';
import { CreateValue } from '~/types';
import { dates, data } from '~/utils';

export interface IEmployeeValue {
    id: string;
    type: EMPLOYEE_TYPE;
    firstName: string;
    lastName: string;
    surname: string;
    rank: string;
    position: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createEmployeeDTO = (
    value: CreateValue<IEmployeeValue>,
): CreateValue<IEmployeeDTO> => ({
    type: value?.type ?? null,
    firstName: String(value?.firstName) ?? '',
    lastName: String(value?.lastName) ?? '',
    surname: String(value?.surname) ?? '',
    rankId: value?.rank ?? '',
    position: value?.position ?? '',
});

export const updateEmployeeDTO = data.createUpdateDTO<IEmployeeValue, IEmployeeDTO>((value) => ({
    type: value?.type ?? EMPLOYEE_TYPE.WORKER,
    firstName: String(value?.firstName) ?? '',
    lastName: String(value?.lastName) ?? '',
    surname: String(value?.surname) ?? '',
    rankId: value?.rank ?? '',
    position: value?.position ?? '',
}));

export const createEmployee = (employee: IEmployeeDTO): IEmployeeValue => ({
    id: employee.id,
    type: employee.type || EMPLOYEE_TYPE.WORKER,
    firstName: String(employee.firstName) || '',
    lastName: String(employee.lastName) || '',
    surname: String(employee.surname) || '',
    rank: employee.rankId,
    position: employee.position || '',
    createdAt: dates.fromServerDate(employee.createdAt),
    updatedAt: dates.fromServerDate(employee.updatedAt),
});
