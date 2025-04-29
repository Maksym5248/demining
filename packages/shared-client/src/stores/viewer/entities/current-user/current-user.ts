import { makeAutoObservable } from 'mobx';

import { type ICurrentUserAPI } from '~/api';
import { type IDataModel, RequestModel } from '~/models';

import { type ICurrentUserInfoUpdateData, type ICurrentUserData, createUpdateCurrentUserInfoDTO } from './current-user.schema';

export interface ICurrentUser extends IDataModel<ICurrentUserData> {
    displayName: string | undefined;
    updateInfo: RequestModel<[ICurrentUserInfoUpdateData]>;
}

interface IApi {
    currentUser: ICurrentUserAPI;
}

export class CurrentUser implements ICurrentUser {
    data: ICurrentUserData;
    api: IApi;

    constructor(data: ICurrentUserData, params: { api: IApi }) {
        this.data = data;
        this.api = params.api;

        makeAutoObservable(this);
    }

    updateFields(data: Partial<ICurrentUserData>) {
        Object.assign(this.data, data);
    }

    updateFieldsInfo(data: Partial<ICurrentUserInfoUpdateData>) {
        Object.assign(this.data.info, data);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.info?.name || this.data.info?.email;
    }

    updateInfo = new RequestModel({
        run: async (params: ICurrentUserInfoUpdateData) => {
            const v = createUpdateCurrentUserInfoDTO(params);
            await this.api.currentUser.updateInfo(this.id, v);
            this.updateFieldsInfo(params);
        },
    });
}
