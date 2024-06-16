import { EMPLOYEE_TYPE } from '@/shared';
import {
    type CreateValue,
    type IRequestModel,
    RequestModel,
    type ICollectionModel,
    type IListModel,
    CollectionModel,
    ListModel,
} from '@/shared-client';
import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { Api, type IEmployeeDTO } from '~/api';
import { ranksData } from '~/data';
import { dates } from '~/utils';

import {
    Rank,
    type IRank,
    type IRankValue,
    Employee,
    type IEmployee,
    type IEmployeeValue,
    createEmployee,
    createEmployeeDTO,
    createRank,
    EmployeeAction,
    type IEmployeeAction,
    type IEmployeeActionValue,
} from './entities';

export interface IEmployeeStore {
    collection: ICollectionModel<IEmployee, IEmployeeValue>;
    list: IListModel<IEmployee, IEmployeeValue>;
    searchList: IListModel<IEmployee, IEmployeeValue>;

    ranksCollection: ICollectionModel<IRank, IRankValue>;
    ranksList: IListModel<IRank, IRankValue>;

    collectionActions: ICollectionModel<IEmployeeAction, IEmployeeActionValue>;

    chiefs: IEmployee[];
    squadLeads: IEmployee[];
    workers: IEmployee[];
    chiefFirst: IEmployee;
    squadLeadFirst: IEmployee;

    init: () => void;
    getById: (id: string) => IEmployee | undefined;
    append: (res: IEmployeeDTO[], isSearch: boolean, isMore?: boolean) => void;
    setAll: (res: IEmployeeDTO[]) => void;
    create: IRequestModel<[CreateValue<IEmployeeValue>]>;
    remove: IRequestModel<[string]>;
    fetchListAll: IRequestModel;
    fetchList: IRequestModel<[search: string]>;
    fetchMoreList: IRequestModel<[search: string]>;
    fetchItem: IRequestModel<[string]>;
}

export class EmployeeStore implements IEmployeeStore {
    collection = new CollectionModel<IEmployee, IEmployeeValue>({
        factory: (data: IEmployeeValue) => new Employee(data, { collections: { rank: this.ranksCollection } }),
    });
    list = new ListModel<IEmployee, IEmployeeValue>({ collection: this.collection });
    searchList = new ListModel<IEmployee, IEmployeeValue>({ collection: this.collection });

    ranksCollection = new CollectionModel<IRank, IRankValue>({
        factory: (data: IRankValue) => new Rank(data),
    });
    ranksList = new ListModel<IRank, IRankValue>({ collection: this.ranksCollection });

    collectionActions = new CollectionModel<IEmployeeAction, IEmployeeActionValue>({
        factory: (data: IEmployeeActionValue) => new EmployeeAction(data, { collections: { rank: this.ranksCollection } }),
    });

    constructor() {
        makeAutoObservable(this);
    }

    get chiefs() {
        return this.list.asArray.filter((el) => el.type === EMPLOYEE_TYPE.CHIEF);
    }

    get squadLeads() {
        return this.list.asArray.filter((el) => el.type === EMPLOYEE_TYPE.SQUAD_LEAD);
    }

    get workers() {
        return this.list.asArray.filter((el) => el.type !== EMPLOYEE_TYPE.CHIEF);
    }

    get chiefFirst() {
        return this.chiefs[0];
    }

    get squadLeadFirst() {
        return this.squadLeads[0];
    }

    init() {
        this.ranksList.push(ranksData.map(createRank));
    }

    getById(id: string) {
        return this.collection.get(id);
    }

    append(res: IEmployeeDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createEmployee));
    }

    setAll(res: IEmployeeDTO[]) {
        this.list.setMore(false);
        this.list.push(res.map(createEmployee));
    }

    create = new RequestModel({
        run: async (data: CreateValue<IEmployeeValue>) => {
            const res = await Api.employee.create(createEmployeeDTO(data));
            this.list.unshift(createEmployee(res));
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await Api.employee.remove(id);
            this.list.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => message.success('Видалено успішно'),
        onError: () => message.error('Не вдалось видалити'),
    });

    fetchListAll = new RequestModel({
        run: async () => {
            const res = await Api.employee.getList();
            this.setAll(res);
        },
    });

    fetchList = new RequestModel({
        shouldRun: (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return !(!isSearch && list.length);
        },
        run: async (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await Api.employee.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return list.isMorePages;
        },
        run: async (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await Api.employee.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.createdAt),
            });

            this.append(res, isSearch, true);
        },
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await Api.employee.get(id);
            this.collection.set(res.id, createEmployee(res));
        },
        onError: () => message.error('Виникла помилка'),
    });
}
