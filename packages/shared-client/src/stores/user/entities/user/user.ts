import { makeAutoObservable } from 'mobx';
import { type ROLES } from 'shared-my';

import { type IUserAPI } from '~/api';
import { RequestModel, type IDataModel } from '~/models';

import { type IUpdateUserParams, type IUserData } from './user.schema';

export interface IUser extends IDataModel<IUserData> {
    hasRole(role: ROLES): boolean;
    update: RequestModel<[user: IUpdateUserParams]>;
    displayName?: string;
    photoUri?: string;
}

interface IApi {
    user: IUserAPI;
}

export class User implements IUser {
    data: IUserData;
    api: IApi;

    constructor(data: IUserData, params: { api: IApi }) {
        this.data = data;
        this.api = params.api;

        makeAutoObservable(this);
    }

    updateFields(data: Partial<IUserData>) {
        Object.assign(this.data, data);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return (this.data.info.name || this.data.access?.email) ?? undefined;
    }

    get photoUri() {
        return this.data.info.photoUri ?? undefined;
    }

    hasRole(role: ROLES) {
        return !!this.data.access?.[role];
    }

    update = new RequestModel({
        run: async (user: IUpdateUserParams) => {
            await this.api.user.update(this.id, user);
            this.updateFields(user);
        },
    });
}
