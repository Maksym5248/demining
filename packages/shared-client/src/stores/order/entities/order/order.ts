import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { Api } from '~/api';
import { type UpdateValue } from '@/shared-client';
import { type ICollectionModel, type IRequestModel, RequestModel } from '@/shared-client';

import { type IOrderValue, type IOrderValueParams, OrderValue, createOrder, updateOrderDTO } from './order.schema';
import { type IEmployeeAction, type IEmployeeActionValue } from '../../../employee';

export interface IOrder extends IOrderValue {
    updateFields(data: Partial<IOrderValue>): void;
    signedByAction?: IEmployeeAction;
    displayValue: string;
    update: IRequestModel<[UpdateValue<IOrderValueParams>]>;
}

interface IOrderParams {
    collections: {
        employeeAction: ICollectionModel<IEmployeeAction, IEmployeeActionValue>;
    };
}

export class Order extends OrderValue implements IOrder {
    collectionEmployeeAction: ICollectionModel<IEmployeeAction, IEmployeeActionValue>;

    constructor(value: IOrderValue, { collections }: IOrderParams) {
        super(value);
        this.collectionEmployeeAction = collections.employeeAction;

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
        run: async (data: UpdateValue<IOrderValueParams>) => {
            const res = await Api.order.update(this.id, updateOrderDTO(data));
            this.updateFields(createOrder(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
