import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IOrderDB } from '~/db';

export interface IOrderValue {
  id: string,
  signedAt: Dayjs,
  signedById: string,
  signedBy: string,
  number: number,
  createdAt: Dayjs,
  updatedAt: Dayjs,
}

export const createOrderDB = (order: Partial<IOrderValue>): CreateValue<IOrderDB>  => ({
  signedAt: dates.toDate(order.signedAt),
  signedById: order.signedById,
  signedBy: order.signedBy ? JSON.stringify(order.signedBy) : undefined,
  number: order.number
});

export const updateOrderDB = data.createUpdateDB<IOrderValue, IOrderDB>(createOrderDB);

export const createOrder = (order: IOrderDB): IOrderValue => ({
  id: order.id,
  signedAt: dates.create(order.signedAt),
  signedById: order.signedById,
  signedBy: order.signedBy ? JSON.parse(order.signedBy): undefined,
  number: order.number,
  createdAt: dates.create(order.createdAt),
  updatedAt: dates.create(order.updatedAt),
});
