import { makeAutoObservable } from 'mobx';
import { str } from 'shared-my/common';

import { type IEmployeeAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel, type ICollectionModel } from '~/models';
import { type IMessage } from '~/services';

import { createEmployee, updateEmployeeDTO, type IEmployeeData } from './employee.schema';
import { type IRank, type IRankData } from '../rank';

export interface IEmployee {
    id: string;
    data: IEmployeeData;
    rank?: IRank;
    fullName: string;
    signName: string;
    updateFields: (data: Partial<IEmployeeData>) => void;
    update: RequestModel<[IUpdateValue<IEmployeeData>]>;
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

export interface IEmployeeParams {
    api: IApi;
    collections: ICollections;
    services: IServices;
}

export class Employee implements IEmployee {
    private api: IApi;
    private collections: ICollections;
    private services: IServices;

    data: IEmployeeData;

    constructor(data: IEmployeeData, params: IEmployeeParams) {
        this.data = data;

        this.collections = params.collections;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get rank() {
        return this.collections.rank.get(this.data.rankId);
    }

    get fullName() {
        return `${this.rank?.data.shortName} ${str.toUpperFirst(this.data.lastName)} ${str.toUpper(this.data.firstName[0])}. ${str.toUpper(this.data.surname[0])}.`;
    }

    get signName() {
        return `${str.toUpper(this.data.firstName[0])}.${str.toUpper(this.data.surname[0])}. ${str.toUpperFirst(this.data.lastName)}`;
    }

    updateFields(data: Partial<IEmployeeData>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IEmployeeData>) => {
            const res = await this.api.employee.update(this.data.id, updateEmployeeDTO(data));
            this.updateFields(createEmployee(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
