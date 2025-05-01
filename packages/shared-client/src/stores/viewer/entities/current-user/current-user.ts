import { makeAutoObservable } from 'mobx';

import { type ICurrentUserAPI } from '~/api';
import { type IDataModel, RequestModel } from '~/models';
import { type IAuth } from '~/services';

import { type ICurrentUserInfoUpdateData, type ICurrentUserData, createUpdateCurrentUserInfoDTO } from './current-user.schema';

export interface ICurrentUser extends IDataModel<ICurrentUserData> {
    email: string | undefined;
    displayName: string | undefined;
    updateInfo: RequestModel<[ICurrentUserInfoUpdateData]>;
}

interface IApi {
    currentUser: ICurrentUserAPI;
}

interface IServices {
    auth: IAuth;
}

export class CurrentUser implements ICurrentUser {
    data: ICurrentUserData;
    api: IApi;
    services: IServices;

    constructor(data: ICurrentUserData, params: { api: IApi; services: IServices }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    updateFields(data: Partial<ICurrentUserData>) {
        Object.assign(this.data, data);
    }

    updateFieldsInfo(data: Partial<ICurrentUserInfoUpdateData>) {
        Object.assign(this.data.info, data);
    }

    get email() {
        return this.services.auth.email();
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.info?.name || this.email;
    }

    updateInfo = new RequestModel({
        run: async (params: ICurrentUserInfoUpdateData) => {
            const v = createUpdateCurrentUserInfoDTO(params);
            await this.api.currentUser.updateInfo(this.id, v);
            this.updateFieldsInfo(params);
        },
    });
}
