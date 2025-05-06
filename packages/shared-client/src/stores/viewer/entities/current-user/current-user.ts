import { makeAutoObservable } from 'mobx';

import { type IUserAPI, type ICurrentUserAPI } from '~/api';
import { User } from '~/index';
import { type IDataModel, RequestModel } from '~/models';
import { type IAuthUser } from '~/services';

import { type ICurrentUserInfoUpdateData, type ICurrentUserData, createUpdateCurrentUserInfoDTO } from './current-user.schema';

export interface ICurrentUser extends IDataModel<ICurrentUserData> {
    email: string | undefined;
    displayName: string | undefined;
    updateInfo: RequestModel<[ICurrentUserInfoUpdateData]>;
    asUser: User;
}

interface IApi {
    currentUser: ICurrentUserAPI;
    user: IUserAPI;
}

export class CurrentUser implements ICurrentUser {
    data: ICurrentUserData;
    api: IApi;
    authData: IAuthUser | null;

    constructor(data: ICurrentUserData, params: { api: IApi; authData: IAuthUser | null }) {
        this.data = data;
        this.api = params.api;
        this.authData = params.authData;

        makeAutoObservable(this);
    }

    get asUser() {
        return new User(this.data, this);
    }

    updateFields(data: Partial<ICurrentUserData>) {
        Object.assign(this.data, data);
    }

    updateFieldsInfo(data: Partial<ICurrentUserInfoUpdateData>) {
        Object.assign(this.data.info, data);
    }

    get email() {
        return this.authData?.email ?? undefined;
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
