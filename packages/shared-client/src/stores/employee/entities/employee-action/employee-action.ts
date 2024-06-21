import { type IEmployeeAPI } from '~/api';
import { customMakeAutoObservable } from '~/common';
import { type CollectionModel } from '~/models';
import { type IMessage } from '~/services';

import { EmployeeActionValue, type IEmployeeActionValue } from './employee-action.schema';
import { type IEmployeeParams, Employee, type IEmployee } from '../employee';
import { type IRank, type IRankValue } from '../rank';

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
        super(data);

        this.collections = params.collections;
        this.api = params.api;
        this.services = params.services;

        customMakeAutoObservable(this);
    }

    get employee() {
        return new Employee(this, this);
    }
}
