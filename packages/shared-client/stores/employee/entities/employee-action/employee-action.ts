import { makeAutoObservable } from 'mobx';

import { type IEmployeeAPI } from '~/api';
import { type CollectionModel } from '~/models';

import { EmployeeActionValue, type IEmployeeActionValue } from './employee-action.schema';
import { type IEmployeeParams, Employee, type IEmployee } from '../employee';
import { type IRank, type IRankValue } from '../rank';

export interface IEmployeeAction extends IEmployeeActionValue {
    employee: IEmployee;
}

interface IApi {
    employee: IEmployeeAPI;
}
export class EmployeeAction extends EmployeeActionValue implements IEmployeeAction {
    private api: Pick<IApi, 'employee'>;
    private collections: {
        rank: CollectionModel<IRank, IRankValue>;
    };

    constructor(data: IEmployeeActionValue, params: IEmployeeParams) {
        const employeeAction = new EmployeeActionValue(data);
        super(employeeAction);

        this.collections = params.collections;
        this.api = params.api;

        makeAutoObservable(this);
    }

    get employee() {
        return new Employee(this, { collections: this.collections, api: this.api });
    }
}
