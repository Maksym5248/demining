import { message } from 'antd';

import { Api } from '~/api';
import { type UpdateValue } from '~/types';
import { str } from '~/utils';
import { type CollectionModel, RequestModel } from '~/utils/models';

import { createEmployee, updateEmployeeDTO, type IEmployeeValue, EmployeeValue } from './employee.schema';
import { type IRank, type IRankValue } from '../rank';

export interface IEmployee extends IEmployeeValue {
    rank?: IRank;
    fullName: string;
    signName: string;
    updateFields: (data: Partial<IEmployeeValue>) => void;
    update: RequestModel<[UpdateValue<IEmployeeValue>]>;
}

export interface IEmployeeParams {
    collections: {
        rank: CollectionModel<IRank, IRankValue>;
    };
}

export class Employee extends EmployeeValue implements IEmployee {
    private ranksCollection: CollectionModel<IRank, IRankValue>;

    constructor(data: IEmployeeValue, params: IEmployeeParams) {
        super(data);
        this.ranksCollection = params.collections.rank;
    }

    get rank() {
        return this.ranksCollection.get(this.rankId);
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
        run: async (data: UpdateValue<IEmployeeValue>) => {
            const res = await Api.employee.update(this.id, updateEmployeeDTO(data));
            this.updateFields(createEmployee(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
