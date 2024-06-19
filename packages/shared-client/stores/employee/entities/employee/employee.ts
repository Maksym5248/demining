import { str } from '@/shared/common';
import { message } from 'antd';

import { type IEmployeeAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type CollectionModel, RequestModel } from '~/models';

import { createEmployee, updateEmployeeDTO, type IEmployeeValue, EmployeeValue } from './employee.schema';
import { type IRank, type IRankValue } from '../rank';

export interface IEmployee extends IEmployeeValue {
    rank?: IRank;
    fullName: string;
    signName: string;
    updateFields: (data: Partial<IEmployeeValue>) => void;
    update: RequestModel<[IUpdateValue<IEmployeeValue>]>;
}

interface IApi {
    employee: IEmployeeAPI;
}

export interface IEmployeeParams {
    collections: {
        rank: CollectionModel<IRank, IRankValue>;
    };
    api: Pick<IApi, 'employee'>;
}

export class Employee extends EmployeeValue implements IEmployee {
    private api: Pick<IApi, 'employee'>;
    private collections: {
        rank: CollectionModel<IRank, IRankValue>;
    };

    constructor(data: IEmployeeValue, params: IEmployeeParams) {
        super(data);
        this.collections = params.collections;
        this.api = params.api;
    }

    get rank() {
        return this.collections.rank.get(this.rankId);
    }

    get fullName() {
        return `${this.rank?.shortName} ${str.toUpperFirst(this.lastName)} ${str.toUpper(this.firstName[0])}. ${str.toUpper(this.surname[0])}.`;
    }

    get signName() {
        return `${str.toUpper(this.firstName[0])}.${str.toUpper(this.surname[0])}. ${str.toUpperFirst(this.lastName)}`;
    }

    updateFields(data: Partial<IEmployeeValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IEmployeeValue>) => {
            const res = await this.api.employee.update(this.id, updateEmployeeDTO(data));
            this.updateFields(createEmployee(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
