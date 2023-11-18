import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IOrderDTO, IOrderDTOParams } from '~/api';

import { createEmployeeHistory, IEmployeeHistoryValue } from "../../../employee"


export interface IOrderValue {
  id: string,
  signedAt: Dayjs,
  signedBy: IEmployeeHistoryValue,
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

export const updateOrderDTO = data.createUpdateDTO<IOrderValueParams, IOrderDTOParams>(createOrderDTO);

export const createOrder = (order: IOrderDTO): IOrderValue => ({
  id: order.id,
  signedAt: dates.create(order.signedAt),
  signedBy: createEmployeeHistory(order.signedBy),
  number: order.number,
  createdAt: dates.create(order.createdAt),
  updatedAt: dates.create(order.updatedAt),
});
