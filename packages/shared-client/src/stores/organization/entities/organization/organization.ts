import { makeAutoObservable } from 'mobx';

import { type IOrganizationAPI, type ICreateOrganizationDTO } from '~/api';
import { type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IUpdateOrganizationParams, type IOrganizationValue, createOrganization, createOrganizationDTO } from './organization.schema';
import { type IUser, type IUserStore, type IUserData, createUser } from '../../../user';
import { type IViewerStore } from '../../../viewer';

export interface IOrganization {
    id: string;
    data: IOrganizationValue;
    listMembers: IListModel<IUser, IUserData>;
    update: IRequestModel<[ICreateOrganizationDTO]>;
    createMember: IRequestModel<[string, boolean, boolean]>;
    updateMember: IRequestModel<[string, boolean, boolean]>;
    removeMember: IRequestModel<[string]>;
    fetchListMembers: IRequestModel;
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
    stores: IStores;
    api: IApi;
    services: IServices;
}

export class Organization implements IOrganization {
    stores: IStores;
    api: IApi;
    services: IServices;
    data: IOrganizationValue;

    listMembers: IListModel<IUser, IUserData>;

    constructor(value: IOrganizationValue, { stores, api, services }: IOrganizationParams) {
        this.data = value;

        this.stores = stores;
        this.api = api;
        this.services = services;

        this.listMembers = new ListModel<IUser, IUserData>({ collection: this.stores.user.collection });

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
        run: async (userId: string, isAdmin: boolean, isAuthor: boolean) => {
            const res = await this.api.organization.updateMember(
                this.data.id,
                userId,
                { isAdmin, isAuthor },
                !!this.stores.viewer.user?.isRootAdmin,
            );

            this.listMembers.push(createUser(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    updateMember = new RequestModel({
        run: async (userId: string, isAdmin: boolean, isAuthor: boolean) => {
            const res = await this.api.organization.updateMember(
                this.data.id,
                userId,
                { isAdmin, isAuthor },
                !!this.stores.viewer.user?.isRootAdmin,
            );
            const member = createUser(res);

            this.stores.user.collection.update(member.id, member);
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    removeMember = new RequestModel({
        run: async (userId: string) => {
            await this.api.organization.removeMember(this.data.id, userId);

            this.stores.user.collection.remove(userId);
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchListMembers = new RequestModel({
        run: async () => {
            const res = await this.api.organization.getMembers(this.data.id);
            this.listMembers.set(res.map(createUser));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
