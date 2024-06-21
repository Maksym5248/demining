import { makeAutoObservable } from 'mobx';

import { type IEmployeeAPI } from '~/api';
import { type CollectionModel } from '~/models';

import { EmployeeActionValue, type IEmployeeActionValue } from './employee-action.schema';
import { type IEmployeeParams, Employee, type IEmployee } from '../employee';
import { type IRank, type IRankValue } from '../rank';
import { IMessage } from '~/services';

export interface IEmployeeAction extends IEmployeeActionValue {
    employee: IEmployee;
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

export class EmployeeAction extends EmployeeActionValue implements IEmployeeAction {
    api: Pick<IApi, 'employee'>;
    collections: ICollections;
    services: IServices;

    constructor(data: IEmployeeActionValue, params: IEmployeeParams) {
        const employeeAction = new EmployeeActionValue(data);
        super(employeeAction);

        this.collections = params.collections;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get employee() {
        return new Employee(this, this);
    }
}
