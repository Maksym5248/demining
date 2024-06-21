import { str } from 'shared-my/common';

import { type IEmployeeAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type CollectionModel, RequestModel } from '~/models';

import { createEmployee, updateEmployeeDTO, type IEmployeeValue, EmployeeValue } from './employee.schema';
import { type IRank, type IRankValue } from '../rank';
import { IMessage } from '~/services';

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

interface IServices {
    message: IMessage;
}

interface ICollections {
    rank: CollectionModel<IRank, IRankValue>;
}

export interface IEmployeeParams {
    api: IApi;
    collections: ICollections;
    services: IServices;
}

export class Employee extends EmployeeValue implements IEmployee {
    private api: IApi;
    private collections: ICollections;
    private services: IServices;

    constructor(data: IEmployeeValue, params: IEmployeeParams) {
        super(data);
        this.collections = params.collections;
        this.api = params.api;
        this.services = params.services;
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
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () =>this.services.message.error('Не вдалось додати'),
    });
}
