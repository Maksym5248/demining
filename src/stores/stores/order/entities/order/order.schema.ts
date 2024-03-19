import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IOrderDTO, IOrderDTOParams, IOrderPreviewDTO } from '~/api';

export interface IOrderValue {
  id: string,
  signedAt: Dayjs,
  signedByAction?: string,
  number: number,
  createdAt: Dayjs,
  updatedAt: Dayjs,
}

export interface IOrderValueParams {
  id: string,
  signedAt: Dayjs,
  signedById: string,
  number: number,
  createdAt: Dayjs,
  updatedAt: Dayjs,
}

export const createOrderDTO = (order: CreateValue<IOrderValueParams>): CreateValue<IOrderDTOParams>  => ({
	signedAt: dates.toDateServer(order.signedAt),
	signedById: order.signedById,
	number: order.number
});

export const updateOrderDTO = data.createUpdateDTO<IOrderValueParams, IOrderDTOParams>(value => ({
	signedAt: dates.toDateServer(value?.signedAt ?? new Date()),
	signedById: value?.signedById ?? "",
	number: value?.number ?? 0
}));

export const createOrderPreview = (order: IOrderPreviewDTO): IOrderValue => ({
	id: order.id,
	signedAt: dates.create(order.signedAt),
	number: order.number,
	createdAt: dates.create(order.createdAt),
	updatedAt: dates.create(order.updatedAt),
});

export const createOrder = (order: IOrderDTO): IOrderValue => ({
	...createOrderPreview(order),
	signedByAction: order?.signedByAction.id,
});
