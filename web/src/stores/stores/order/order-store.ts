import { message } from 'antd';
import { types, Instance } from 'mobx-state-tree';

import { Api, IOrderPreviewDTO } from '~/api';
import { CreateValue } from '~/types';
import { dates } from '~/utils';

import {
    IOrder,
    IOrderValue,
    IOrderValueParams,
    Order,
    createOrder,
    createOrderDTO,
    createOrderPreview,
} from './entities';
import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { createEmployeeAction } from '../employee';

const Store = types
    .model('OrderStore', {
        collection: createCollection<IOrder, IOrderValue>('Orders', Order),
        list: createList<IOrder>('OrdersList', safeReference(Order), { pageSize: 10 }),
        searchList: createList<IOrder>('OrderSearchList', safeReference(Order), { pageSize: 10 }),
    })
    .actions((self) => ({
        append(res: IOrderPreviewDTO[], isSearch: boolean, isMore?: boolean) {
            const list = isSearch ? self.searchList : self.list;
            if (isSearch && !isMore) self.searchList.clear();

            list.checkMore(res.length);

            res.forEach((el) => {
                const value = createOrderPreview(el);
                self.collection.set(value.id, value);
                if (!list.includes(value.id)) list.push(value.id);
            });
        },
    }));

const create = asyncAction<Instance<typeof Store>>(
    (data: CreateValue<IOrderValueParams>) =>
        async function fn({ flow, self, root }) {
            try {
                flow.start();

                const res = await Api.order.create(createOrderDTO(data));

                const order = createOrder(res);

                root.employee.collectionActions.set(
                    res.signedByAction?.id,
                    createEmployeeAction(res.signedByAction),
                );

                self.collection.set(order.id, order);
                self.list.unshift(order.id);

                flow.success();
                message.success('Додано успішно');
            } catch (err) {
                flow.failed(err as Error);
                message.error('Не вдалось додати');
            }
        },
);

const remove = asyncAction<Instance<typeof Store>>(
    (id: string) =>
        async function fn({ flow, self }) {
            try {
                flow.start();
                await Api.order.remove(id);
                self.list.removeById(id);
                self.collection.remove(id);
                flow.success();
                message.success('Видалено успішно');
            } catch (err) {
                flow.failed(err as Error);
                message.error('Не вдалось видалити');
            }
        },
);

const fetchItem = asyncAction<Instance<typeof Store>>(
    (id: string) =>
        async function fn({ flow, self, root }) {
            try {
                flow.start();
                const res = await Api.order.get(id);
                root.employee.collectionActions.set(
                    res.signedByAction?.id,
                    createEmployeeAction(res.signedByAction),
                );
                self.collection.set(res.id, createOrder(res));

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

const fetchList = asyncAction<Instance<typeof Store>>(
    (search: string) =>
        async function fn({ flow, self }) {
            try {
                const isSearch = !!search;
                const list = isSearch ? self.searchList : self.list;

                if (!isSearch && list.length) return;

                flow.start();

                const res = await Api.order.getList({
                    search,
                    limit: list.pageSize,
                });

                self.append(res, isSearch);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

const fetchListMore = asyncAction<Instance<typeof Store>>(
    (search: string) =>
        async function fn({ flow, self }) {
            try {
                const isSearch = !!search;
                const list = isSearch ? self.searchList : self.list;

                if (!list.isMorePages) return;

                flow.start();

                const res = await Api.order.getList({
                    search,
                    limit: list.pageSize,
                    startAfter: dates.toDateServer(list.last.createdAt),
                });

                self.append(res, isSearch, true);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

export const OrderStore = Store.props({ create, remove, fetchList, fetchListMore, fetchItem });
