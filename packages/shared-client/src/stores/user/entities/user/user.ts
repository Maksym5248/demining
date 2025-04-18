import { makeAutoObservable } from 'mobx';
import { type ROLES } from 'shared-my';

import { type IUserAPI } from '~/api';
import { RequestModel, type IDataModel } from '~/models';
import { type IMessage } from '~/services';

import { type IUpdateUserParams, type IUserData } from './user.schema';

export interface IUser extends IDataModel<IUserData> {
    hasRole(role: ROLES): boolean;
    update: RequestModel<[user: IUpdateUserParams]>;
}

interface IApi {
    user: IUserAPI;
}

interface IServices {
    message: IMessage;
}

export class User implements IUser {
    data: IUserData;
    api: IApi;
    services: IServices;

    constructor(data: IUserData, params: { api: IApi; services: IServices }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    updateFields(data: Partial<IUserData>) {
        Object.assign(this, data);
    }

    get id() {
        return this.data.id;
    }

    hasRole(role: ROLES) {
        return !!this.data.access.roles[role];
    }

    update = new RequestModel({
        run: async (user: IUpdateUserParams) => {
            const res = await this.api.user.update(this.id, user);
            this.updateFields(res);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
