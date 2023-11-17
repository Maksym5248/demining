import { Dayjs } from 'dayjs';
import { getSnapshot, IStateTreeNode } from 'mobx-state-tree';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IOrderDB, IEmployeeDB } from '~/db';



export interface IOrderValue {
  id: string,
  signedAt: Dayjs,
  signedBy: IEmployeeDB,
  number: number,
  createdAt: Dayjs,
  updatedAt: Dayjs,
}

export const createOrderDB = (order: Partial<IOrderValue>): CreateValue<IOrderDB>  => ({
  signedAt: dates.toDate(order.signedAt),
  signedById: order.signedBy.id,
  signedBy: getSnapshot(order.signedBy as IStateTreeNode),
  number: order.number
});

export const updateOrderDB = data.createUpdateDB<IOrderValue, IOrderDB>(createOrderDB);

export const createOrder = (order: IOrderDB): IOrderValue => ({
  id: order.id,
  signedAt: dates.create(order.signedAt),
  signedBy: order.signedBy,
  number: order.number,
  createdAt: dates.create(order.createdAt),
  updatedAt: dates.create(order.updatedAt),
});
