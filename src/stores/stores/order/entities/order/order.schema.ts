import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IOrderDTO, IOrderDTOParams } from '~/api';

import { createEmployeeHistory, IEmployeeHistoryValue } from "../../../employee"


export interface IOrderValue {
  id: string,
  signedAt: Dayjs,
  signedByHistory: IEmployeeHistoryValue,
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
	signedAt: dates.toDate(order.signedAt),
	signedById: order.signedById,
	number: order.number
});

export const updateOrderDTO = data.createUpdateDTO<IOrderValueParams, IOrderDTOParams>(value => ({
	signedAt: dates.toDate(value?.signedAt ?? new Date()),
	signedById: value?.signedById ?? "",
	number: value?.number ?? 0
}));

export const createOrder = (order: IOrderDTO): IOrderValue => ({
	id: order.id,
	signedAt: dates.create(order.signedAt),
	signedByHistory: createEmployeeHistory(order.signedByHistory),
	number: order.number,
	createdAt: dates.create(order.createdAt),
	updatedAt: dates.create(order.updatedAt),
});
