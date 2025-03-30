import { makeAutoObservable } from 'mobx';
import { EMPLOYEE_TYPE } from 'shared-my';

import { type IEmployeeAPI } from '~/api';
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
    collectionActions: ICollectionModel<IEmployeeAction, IEmployeeActionData>;
    collectionRanks: ICollectionModel<IRank, IRankData>;

    list: IListModel<IEmployee, IEmployeeData>;
    listRanks: IListModel<IRank, IRankData>;

    chiefs: IEmployee[];
    squadLeads: IEmployee[];
    workers: IEmployee[];
    chiefFirst: IEmployee;
    squadLeadFirst: IEmployee;
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

    collectionRanks = new CollectionModel<IRank, IRankData>({
        factory: (data: IRankData) => new Rank(data),
    });
    collection = new CollectionModel<IEmployee, IEmployeeData>({
        factory: (data: IEmployeeData) => new Employee(data, { collections: { rank: this.collectionRanks }, ...this }),
    });
    collectionActions = new CollectionModel<IEmployeeAction, IEmployeeActionData>({
        factory: (data: IEmployeeActionData) => new EmployeeAction(data, { collections: { rank: this.collectionRanks }, ...this }),
    });

    list = new ListModel<IEmployee, IEmployeeData>({ collection: this.collection });
    listRanks = new ListModel<IRank, IRankData>({ collection: this.collectionRanks });

    constructor({ api, services }: { api: IApi; services: IServices }) {
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get chiefs() {
        return this.list.asArray.filter(el => el.data.type === EMPLOYEE_TYPE.CHIEF);
    }

    get squadLeads() {
        return this.list.asArray.filter(el => el.data.type === EMPLOYEE_TYPE.SQUAD_LEAD);
    }

    get workers() {
        return this.list.asArray.filter(el => el.data.type !== EMPLOYEE_TYPE.CHIEF);
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

    fetchRanks = new RequestModel({
        shouldRun: () => !this.listRanks.length,
        run: async () => {
            const res = await this.api.employee.getlistRanks();
            this.listRanks.push(res.map(createRank));
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
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchListAll = new RequestModel({
        run: async () => {
            const res = await this.api.employee.getList();
            this.list.setMore(false);
            this.list.set(res.map(createEmployee));
        },
    });

    fetchList = new RequestModel({
        run: async (search: string) => {
            const res = await this.api.employee.getList({
                search,
                limit: this.list.pageSize,
            });

            this.list.set(res.map(createEmployee));
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => !!this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.employee.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createEmployee));
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
