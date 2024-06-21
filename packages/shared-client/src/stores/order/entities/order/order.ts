import { type IOrderAPI } from '~/api';
import { customMakeAutoObservable, type IUpdateValue } from '~/common';
import { type ICollectionModel, type IRequestModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IOrderValue, type IOrderValueParams, OrderValue, createOrder, updateOrderDTO } from './order.schema';
import { type IEmployeeAction, type IEmployeeActionValue } from '../../../employee';

export interface IOrder extends IOrderValue {
    updateFields(data: Partial<IOrderValue>): void;
    signedByAction?: IEmployeeAction;
    displayValue: string;
    update: IRequestModel<[IUpdateValue<IOrderValueParams>]>;
}

interface IServices {
    message: IMessage;
}
interface IApi {
    order: IOrderAPI;
}

interface ICollections {
    employeeAction: ICollectionModel<IEmployeeAction, IEmployeeActionValue>;
}

interface IOrderParams {
    collections: {
        employeeAction: ICollectionModel<IEmployeeAction, IEmployeeActionValue>;
    };
    api: IApi;
    services: IServices;
}

export class Order extends OrderValue implements IOrder {
    api: IApi;
    services: IServices;
    collections: ICollections;

    constructor(value: IOrderValue, { collections, api, services }: IOrderParams) {
        super(value);
        this.collections = collections;
        this.api = api;
        this.services = services;

        customMakeAutoObservable(this);
    }

    get signedByAction() {
        return this.collections.employeeAction.get(this.signedByActionId);
    }

    get displayValue() {
        return `№${this.number} ${this.signedAt.format('DD/MM/YYYY')}`;
    }

    updateFields(data: Partial<IOrderValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IOrderValueParams>) => {
            const res = await this.api.order.update(this.id, updateOrderDTO(data));
            this.updateFields(createOrder(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
