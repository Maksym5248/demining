import { makeAutoObservable } from 'mobx';

import { type IOrganizationAPI, type ICreateOrganizationDTO } from '~/api';
import { dates } from '~/common';
import { type IDataModel, type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IUpdateOrganizationParams, type IOrganizationValue, createOrganization, createOrganizationDTO } from './organization.schema';
import { type IUser, type IUserStore, type IUserData, createUser } from '../../../user';
import { type IViewerStore } from '../../../viewer';

export interface IOrganization extends IDataModel<IOrganizationValue> {
    listMembers: IListModel<IUser, IUserData>;
    update: IRequestModel<[ICreateOrganizationDTO]>;
    createMember: IRequestModel<[string]>;
    removeMember: IRequestModel<[string]>;
    fetchListMembers: IRequestModel<[string | undefined]>;
    fetchMoreListMembers: IRequestModel<[string | undefined]>;
}

interface IApi {
    organization: IOrganizationAPI;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    viewer: IViewerStore;
    user: IUserStore;
}

interface IOrganizationParams {
    getStores: () => IStores;
    api: IApi;
    services: IServices;
}

export class Organization implements IOrganization {
    getStores: () => IStores;
    api: IApi;
    services: IServices;
    data: IOrganizationValue;

    listMembers: IListModel<IUser, IUserData>;

    constructor(value: IOrganizationValue, { getStores, api, services }: IOrganizationParams) {
        this.data = value;

        this.getStores = getStores;
        this.api = api;
        this.services = services;

        this.listMembers = new ListModel<IUser, IUserData>({ collection: this.getStores().user.collection });

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<IOrganizationValue>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateOrganizationParams) => {
            const res = await this.api.organization.update(this.data.id, createOrganizationDTO(data));

            this.updateFields(createOrganization(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    createMember = new RequestModel({
        run: async (userId: string) => {
            const res = await this.api.organization.addMember(this.data.id, userId);

            this.listMembers.push(createUser(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    removeMember = new RequestModel({
        run: async (userId: string) => {
            await this.api.organization.removeMember(this.data.id, userId);

            this.getStores().user.collection.remove(userId);
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchListMembers = new RequestModel({
        run: async (search: string | undefined) => {
            const res = await this.api.organization.getMembers(this.data.id, {
                search,
                limit: this.listMembers.pageSize,
            });
            this.listMembers.set(res.map(createUser));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreListMembers = new RequestModel({
        run: async (search: string | undefined) => {
            const res = await this.api.organization.getMembers(this.data.id, {
                search,
                limit: this.listMembers.pageSize,
                startAfter: dates.toDateServer(this.listMembers.last.data.createdAt),
            });
            this.listMembers.push(res.map(createUser));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
