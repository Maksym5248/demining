import { makeAutoObservable } from 'mobx';
import { EMPLOYEE_TYPE } from 'shared-my';

import { type IEmployeeAPI, type IEmployeeDTO } from '~/api';
import { type ICreateValue, dates } from '~/common';
import { CollectionModel, type ICollectionModel, type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    Rank,
    type IRank,
    type IRankData,
    Employee,
    type IEmployee,
    type IEmployeeData,
    createEmployee,
    createEmployeeDTO,
    createRank,
    EmployeeAction,
    type IEmployeeAction,
    type IEmployeeActionData,
} from './entities';

export interface IEmployeeStore {
    collection: ICollectionModel<IEmployee, IEmployeeData>;
    list: IListModel<IEmployee, IEmployeeData>;
    searchList: IListModel<IEmployee, IEmployeeData>;

    ranksCollection: ICollectionModel<IRank, IRankData>;
    ranksList: IListModel<IRank, IRankData>;

    collectionActions: ICollectionModel<IEmployeeAction, IEmployeeActionData>;

    chiefs: IEmployee[];
    squadLeads: IEmployee[];
    workers: IEmployee[];
    chiefFirst: IEmployee;
    squadLeadFirst: IEmployee;

    getById: (id: string) => IEmployee | undefined;
    append: (res: IEmployeeDTO[], isSearch: boolean, isMore?: boolean) => void;
    setAll: (res: IEmployeeDTO[]) => void;
    fetchRanks: IRequestModel;
    create: IRequestModel<[ICreateValue<IEmployeeData>]>;
    remove: IRequestModel<[string]>;
    fetchListAll: IRequestModel;
    fetchList: IRequestModel<[search: string]>;
    fetchMoreList: IRequestModel<[search: string]>;
    fetchItem: IRequestModel<[string]>;
}

interface IApi {
    employee: IEmployeeAPI;
}

interface IServices {
    message: IMessage;
}

export class EmployeeStore implements IEmployeeStore {
    api: IApi;
    services: IServices;

    collection = new CollectionModel<IEmployee, IEmployeeData>({
        factory: (data: IEmployeeData) => new Employee(data, { collections: { rank: this.ranksCollection }, ...this }),
    });
    list = new ListModel<IEmployee, IEmployeeData>({ collection: this.collection });
    searchList = new ListModel<IEmployee, IEmployeeData>({ collection: this.collection });
    ranksCollection = new CollectionModel<IRank, IRankData>({
        factory: (data: IRankData) => new Rank(data),
    });
    ranksList = new ListModel<IRank, IRankData>({ collection: this.ranksCollection });

    collectionActions = new CollectionModel<IEmployeeAction, IEmployeeActionData>({
        factory: (data: IEmployeeActionData) => new EmployeeAction(data, { collections: { rank: this.ranksCollection }, ...this }),
    });

    constructor({ api, services }: { api: IApi; services: IServices }) {
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get chiefs() {
        return this.list.asArray.filter((el) => el.data.type === EMPLOYEE_TYPE.CHIEF);
    }

    get squadLeads() {
        return this.list.asArray.filter((el) => el.data.type === EMPLOYEE_TYPE.SQUAD_LEAD);
    }

    get workers() {
        return this.list.asArray.filter((el) => el.data.type !== EMPLOYEE_TYPE.CHIEF);
    }

    get chiefFirst() {
        return this.chiefs[0];
    }

    get squadLeadFirst() {
        return this.squadLeads[0];
    }

    getById(id: string) {
        return this.collection.get(id);
    }

    append(res: IEmployeeDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createEmployee), true);
    }

    setAll(res: IEmployeeDTO[]) {
        this.list.setMore(false);
        this.list.push(res.map(createEmployee), true);
    }

    fetchRanks = new RequestModel({
        run: async () => {
            const res = await this.api.employee.getRanksList();
            this.ranksList.push(res.map(createRank), true);
        },
    });

    create = new RequestModel({
        run: async (data: ICreateValue<IEmployeeData>) => {
            const res = await this.api.employee.create(createEmployeeDTO(data));
            this.list.unshift(createEmployee(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.employee.remove(id);
            this.list.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchListAll = new RequestModel({
        run: async () => {
            const res = await this.api.employee.getList();
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

            const res = await this.api.employee.getList({
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

            const res = await this.api.employee.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.data.createdAt),
            });

            this.append(res, isSearch, true);
        },
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.employee.get(id);
            this.collection.set(res.id, createEmployee(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
