import { makeAutoObservable } from 'mobx';

import { CollectionModel } from '~/utils/models';

import { EmployeeActionValue, IEmployeeActionValue } from './employee-action.schema';
import { IEmployeeParams, Employee, IEmployee } from '../employee';
import { IRank, IRankValue } from '../rank';

export interface IEmployeeAction extends IEmployeeActionValue {
    employee: IEmployee;
}
export class EmployeeAction extends EmployeeActionValue implements IEmployeeAction {
    private ranksCollection: CollectionModel<IRank, IRankValue>;

    constructor(data: IEmployeeActionValue, params: IEmployeeParams) {
        const employeeAction = new EmployeeActionValue(data);
        super(employeeAction);

        this.ranksCollection = params.collections.rank;

        makeAutoObservable(this);
    }

    get employee() {
        return new Employee(this, { collections: { rank: this.ranksCollection } });
    }
}
