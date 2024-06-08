import { message } from 'antd';
import { Instance } from 'mobx-state-tree';

import { Api, IEmployeeDTO } from '~/api';
import { EMPLOYEE_TYPE } from '~/constants';
import { ranksData } from '~/data';
import { CreateValue } from '~/types';
import { dates } from '~/utils';

import {
    Rank,
    IRank,
    IRankValue,
    Employee,
    IEmployee,
    IEmployeeValue,
    createEmployee,
    createEmployeeDTO,
    createRank,
    EmployeeAction,
    IEmployeeAction,
    IEmployeeActionValue,
} from './entities';
import { types } from '../../types';
import { asyncAction, createCollection, createList, safeReference } from '../../utils';

const Store = types
    .model('EmployeeStore', {
        ranksCollection: createCollection<IRank, IRankValue>('Ranks', Rank),
        ranksList: createList<IRank>('RanksList', safeReference(Rank), { pageSize: 100 }),

        collectionActions: createCollection<IEmployeeAction, IEmployeeActionValue>(
            'EmployeesActions',
            EmployeeAction,
        ),
        collection: createCollection<IEmployee, IEmployeeValue>('Employees', Employee),
        list: createList<IEmployee>('EmployeesList', safeReference(Employee), { pageSize: 10 }),
        searchList: createList<IEmployee>('EmployeesSearchList', safeReference(Employee), {
            pageSize: 10,
        }),
    })
    .actions((self) => ({
        init() {
            ranksData.forEach((data) => {
                self.ranksCollection.set(data.id, createRank(data));
                self.ranksList.push(data.id);
            });
        },
        append(res: IEmployeeDTO[], isSearch: boolean, isMore?: boolean) {
            const list = isSearch ? self.searchList : self.list;
            if (isSearch && !isMore) self.searchList.clear();

            list.checkMore(res.length);

            res.forEach((el) => {
                const value = createEmployee(el);

                self.collection.set(value.id, value);
                if (!list.includes(value.id)) list.push(value.id);
            });
        },
        setAll(res: IEmployeeDTO[]) {
            self.list.setMore(false);

            res.forEach((el) => {
                const value = createEmployee(el);

                self.collection.set(value.id, value);
                if (!self.list.includes(value.id)) self.list.push(value.id);
            });
        },
    }))
    .views((self) => ({
        get chiefs() {
            return self.list.asArray.filter((el) => el.type === EMPLOYEE_TYPE.CHIEF);
        },
        get squadLeads() {
            return self.list.asArray.filter((el) => el.type === EMPLOYEE_TYPE.SQUAD_LEAD);
        },
        get workers() {
            return self.list.asArray.filter((el) => el.type !== EMPLOYEE_TYPE.CHIEF);
        },
        getById(id: string) {
            return self.collection.get(id);
        },
    }))
    .views((self) => ({
        get chiefFirst() {
            return self.chiefs[0];
        },
        get squadLeadFirst() {
            return self.squadLeads[0];
        },
    }));

const create = asyncAction<Instance<typeof Store>>(
    (data: CreateValue<IEmployeeValue>) =>
        async function fn({ flow, self }) {
            try {
                flow.start();
                const res = await Api.employee.create(createEmployeeDTO(data));
                const employee = createEmployee(res);

                self.collection.set(employee.id, employee);
                self.list.push(employee.id);
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
                await Api.employee.remove(id);
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

const fetchListAll = asyncAction<Instance<typeof Store>>(
    () =>
        async function fn({ flow, self }) {
            try {
                if (!self.list.isMorePages) return;

                flow.start();

                const res = await Api.employee.getList();

                self.setAll(res);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
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

                const res = await Api.employee.getList({
                    search,
                    limit: list.pageSize,
                });

                self.append(res, isSearch);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
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

                const res = await Api.employee.getList({
                    search,
                    limit: list.pageSize,
                    startAfter: dates.toDateServer(list.last.createdAt),
                });

                self.append(res, isSearch, true);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
            }
        },
);

const fetchItem = asyncAction<Instance<typeof Store>>(
    (id: string) =>
        async function fn({ flow, self }) {
            try {
                flow.start();
                const res = await Api.employee.get(id);

                self.collection.set(res.id, createEmployee(res));

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

export const EmployeeStore = Store.props({
    create,
    remove,
    fetchList,
    fetchItem,
    fetchListMore,
    fetchListAll,
});
