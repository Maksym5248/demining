import { message } from 'antd';

import { type IOrganizationAPI, type ICreateOrganizationDTO } from '~/api';
import { type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';

import {
    type IUpdateOrganizationParams,
    type IOrganizationValue,
    OrganizationValue,
    createOrganization,
    createOrganizationDTO,
} from './organization.schema';
import { type IUser, type IUserStore, type IUserValue, createUser } from '../../../user';
import { type IViewerStore } from '../../../viewer';

export interface IOrganization extends IOrganizationValue {
    members: IListModel<IUser, IUserValue>;
    update: IRequestModel<[ICreateOrganizationDTO]>;
    createMember: IRequestModel<[string, boolean]>;
    removeMember: IRequestModel<[string]>;
    updateMember: IRequestModel<[string, boolean]>;
    fetchMembers: IRequestModel;
}

interface IApi {
    organization: IOrganizationAPI;
}

interface IOrganizationParams {
    stores: {
        viewer: IViewerStore;
        user: IUserStore;
    };
    api: IApi;
}

export class Organization extends OrganizationValue implements IOrganization {
    stores: {
        viewer: IViewerStore;
        user: IUserStore;
    };
    api: IApi;
    members: IListModel<IUser, IUserValue>;

    constructor(value: IOrganizationValue, { stores, api }: IOrganizationParams) {
        super(value);

        this.stores = stores;
        this.api = api;
        this.members = new ListModel<IUser, IUserValue>({ collection: this.stores.user.collection });
    }

    updateFields(data: Partial<IOrganizationValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateOrganizationParams) => {
            const res = await this.api.organization.update(this.id, createOrganizationDTO(data));

            this.updateFields(createOrganization(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    createMember = new RequestModel({
        run: async (userId: string, isAdmin: boolean) => {
            const res = await this.api.organization.updateMember(this.id, userId, isAdmin, !!this.stores.viewer.user?.isRootAdmin);

            this.members.push(createUser(res), true);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    updateMember = new RequestModel({
        run: async (userId: string, isAdmin: boolean) => {
            const res = await this.api.organization.updateMember(this.id, userId, isAdmin, !!this.stores.viewer.user?.isRootAdmin);
            const member = createUser(res);

            this.stores.user.collection.update(member.id, member);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    removeMember = new RequestModel({
        run: async (userId: string) => {
            await this.api.organization.removeMember(this.id, userId);

            this.members.removeById(userId);
            this.stores.user.collection.remove(userId);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось видалити'),
    });

    fetchMembers = new RequestModel({
        returnIfLoaded: true,
        run: async () => {
            const res = await this.api.organization.getMembers(this.id);

            this.members.push(res.map(createUser));
        },
        onError: () => message.error('Виникла помилка'),
    });
}
