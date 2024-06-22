import { makeAutoObservable } from 'mobx';

import { type IEmployeeAPI } from '~/api';
import { type ICollectionModel } from '~/models';
import { type IMessage } from '~/services';

import { type IEmployeeActionData } from './employee-action.schema';
import { type IEmployeeParams, Employee, type IEmployee } from '../employee';
import { type IRank, type IRankData } from '../rank';

export interface IEmployeeAction {
    data: IEmployeeActionData;
    employee: IEmployee;
}

interface IApi {
    employee: IEmployeeAPI;
}

interface IServices {
    message: IMessage;
}

interface ICollections {
    rank: ICollectionModel<IRank, IRankData>;
}

export class EmployeeAction implements IEmployeeAction {
    api: IApi;
    collections: ICollections;
    services: IServices;
    data: IEmployeeActionData;

    constructor(data: IEmployeeActionData, params: IEmployeeParams) {
        this.data = data;

        this.collections = params.collections;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get employee() {
        return new Employee(this.data, this);
    }
}
