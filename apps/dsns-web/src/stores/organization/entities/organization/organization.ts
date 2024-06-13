import { message } from 'antd';

import { Api, ICreateOrganizationDTO } from '~/api';
import { IListModel, IRequestModel, ListModel, RequestModel } from '~/utils/models';

import {
    IUpdateOrganizationParams,
    IOrganizationValue,
    OrganizationValue,
    createOrganization,
    createOrganizationDTO,
} from './organization.schema';
import { IUser, IUserStore, IUserValue, User, createUser } from '../../../user';
import { IViewerStore } from '../../../viewer';

export interface IOrganization extends IOrganizationValue {
    members: IListModel<IUser, IUserValue>;
    update: IRequestModel<[ICreateOrganizationDTO]>;
    createMember: IRequestModel<[string, boolean]>;
    removeMember: IRequestModel<[string]>;
    updateMember: IRequestModel<[string, boolean]>;
    fetchMembers: IRequestModel;
}

interface IOrganizationParams {
    stores: {
        viewer: IViewerStore;
        user: IUserStore;
    };
}

export class Organization extends OrganizationValue implements IOrganization {
    stores: {
        viewer: IViewerStore;
        user: IUserStore;
    };
    members: IListModel<IUser, IUserValue>;

    constructor(value: IOrganizationValue, { stores }: IOrganizationParams) {
        super(value);

        this.stores = stores;
        this.members = new ListModel<IUser, IUserValue>({ collection: this.stores.user.collection });
    }

    updateFields(data: Partial<IOrganizationValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateOrganizationParams) => {
            const res = await Api.organization.update(this.id, createOrganizationDTO(data));

            this.updateFields(createOrganization(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    createMember = new RequestModel({
        run: async (userId: string, isAdmin: boolean) => {
            const res = await Api.organization.updateMember(this.id, userId, isAdmin, !!this.stores.viewer.user?.isRootAdmin);

            this.members.push(createUser(res), true);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    updateMember = new RequestModel({
        run: async (userId: string, isAdmin: boolean) => {
            const res = await Api.organization.updateMember(this.id, userId, isAdmin, !!this.stores.viewer.user?.isRootAdmin);
            const member = createUser(res);

            this.stores.user.collection.update(member.id, member);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    removeMember = new RequestModel({
        run: async (userId: string) => {
            await Api.organization.removeMember(this.id, userId);

            this.members.removeById(userId);
            this.stores.user.collection.remove(userId);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось видалити'),
    });

    fetchMembers = new RequestModel({
        returnIfLoaded: true,
        run: async () => {
            const res = await Api.organization.getMembers(this.id);

            this.members.push(res.map(createUser));
        },
        onError: () => message.error('Виникла помилка'),
    });
}
