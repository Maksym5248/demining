import { type Dayjs } from 'dayjs';

import { type IOrderFullDTO, type IOrderDTOParams, type IOrderDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IOrderData {
    id: string;
    signedAt: Dayjs;
    signedByActionId?: string;
    number: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IOrderDataParams {
    id: string;
    signedAt: Dayjs;
    signedById: string;
    number: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createOrderDTO = (order: ICreateValue<IOrderDataParams>): ICreateValue<IOrderDTOParams> => ({
    signedAt: dates.toDateServer(order.signedAt),
    signedById: order.signedById,
    number: order.number,
});

export const updateOrderDTO = data.createUpdateDTO<IOrderDataParams, IOrderDTOParams>(value => ({
    signedAt: dates.toDateServer(value?.signedAt ?? new Date()),
    signedById: value?.signedById ?? '',
    number: value?.number ?? 0,
}));

export const createOrder = (order: IOrderDTO): IOrderData => ({
    id: order.id,
    signedAt: dates.fromServerDate(order.signedAt),
    number: order.number,
    createdAt: dates.fromServerDate(order.createdAt),
    updatedAt: dates.fromServerDate(order.updatedAt),
});

export const createOrderFull = (order: IOrderFullDTO): IOrderData => ({
    ...createOrder(order),
    signedByActionId: order?.signedByAction.id,
});
