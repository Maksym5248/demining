import { makeAutoObservable } from 'mobx';

import { type IOrderAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type ICollectionModel, type IRequestModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IOrderData, type IOrderDataParams, createOrderFull, updateOrderDTO } from './order.schema';
import { type IEmployeeAction, type IEmployeeActionData } from '../../../employee';

export interface IOrder {
    id: string;
    data: IOrderData;
    updateFields(data: Partial<IOrderData>): void;
    signedByAction?: IEmployeeAction;
    displayValue: string;
    update: IRequestModel<[IUpdateValue<IOrderDataParams>]>;
}

interface IServices {
    message: IMessage;
}
interface IApi {
    order: IOrderAPI;
}

interface ICollections {
    employeeAction: ICollectionModel<IEmployeeAction, IEmployeeActionData>;
}

interface IOrderParams {
    collections: {
        employeeAction: ICollectionModel<IEmployeeAction, IEmployeeActionData>;
    };
    api: IApi;
    services: IServices;
}

export class Order implements IOrder {
    api: IApi;
    services: IServices;
    collections: ICollections;
    data: IOrderData;

    constructor(data: IOrderData, { collections, api, services }: IOrderParams) {
        this.data = data;
        this.collections = collections;
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get signedByAction() {
        return this.collections.employeeAction.get(this.data.signedByActionId);
    }

    get displayValue() {
        return `№${this.data.number} ${this.data.signedAt.format('DD/MM/YYYY')}`;
    }

    updateFields(data: Partial<IOrderData>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IOrderDataParams>) => {
            const res = await this.api.order.update(this.data.id, updateOrderDTO(data));
            this.updateFields(createOrderFull(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
