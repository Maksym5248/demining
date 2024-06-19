import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { type IOrderAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type ICollectionModel, type IRequestModel, RequestModel } from '~/models';

import { type IOrderValue, type IOrderValueParams, OrderValue, createOrder, updateOrderDTO } from './order.schema';
import { type IEmployeeAction, type IEmployeeActionValue } from '../../../employee';

export interface IOrder extends IOrderValue {
    updateFields(data: Partial<IOrderValue>): void;
    signedByAction?: IEmployeeAction;
    displayValue: string;
    update: IRequestModel<[IUpdateValue<IOrderValueParams>]>;
}

interface IApi {
    order: IOrderAPI;
}

interface IOrderParams {
    collections: {
        employeeAction: ICollectionModel<IEmployeeAction, IEmployeeActionValue>;
    };
    api: IApi;
}

export class Order extends OrderValue implements IOrder {
    api: IApi;
    collectionEmployeeAction: ICollectionModel<IEmployeeAction, IEmployeeActionValue>;

    constructor(value: IOrderValue, { collections, api }: IOrderParams) {
        super(value);
        this.collectionEmployeeAction = collections.employeeAction;
        this.api = api;

        makeAutoObservable(this);
    }

    get signedByAction() {
        return this.collectionEmployeeAction.get(this.signedByActionId);
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
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
