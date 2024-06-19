import { type Dayjs } from 'dayjs';

import { type IOrderDTO, type IOrderDTOParams, type IOrderPreviewDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IOrderValue {
    id: string;
    signedAt: Dayjs;
    signedByActionId?: string;
    number: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IOrderValueParams {
    id: string;
    signedAt: Dayjs;
    signedById: string;
    number: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createOrderDTO = (order: ICreateValue<IOrderValueParams>): ICreateValue<IOrderDTOParams> => ({
    signedAt: dates.toDateServer(order.signedAt),
    signedById: order.signedById,
    number: order.number,
});

export const updateOrderDTO = data.createUpdateDTO<IOrderValueParams, IOrderDTOParams>((value) => ({
    signedAt: dates.toDateServer(value?.signedAt ?? new Date()),
    signedById: value?.signedById ?? '',
    number: value?.number ?? 0,
}));

export const createOrderPreview = (order: IOrderPreviewDTO): IOrderValue => ({
    id: order.id,
    signedAt: dates.fromServerDate(order.signedAt),
    number: order.number,
    createdAt: dates.fromServerDate(order.createdAt),
    updatedAt: dates.fromServerDate(order.updatedAt),
});

export const createOrder = (order: IOrderDTO): IOrderValue => ({
    ...createOrderPreview(order),
    signedByActionId: order?.signedByAction.id,
});

export class OrderValue implements IOrderValue {
    id: string;
    signedAt: Dayjs;
    signedByActionId?: string;
    number: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: IOrderValue) {
        this.id = value.id;
        this.signedAt = value.signedAt;
        this.signedByActionId = value.signedByActionId;
        this.number = value.number;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
