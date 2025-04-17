import { makeAutoObservable } from 'mobx';
import { APPROVE_STATUS } from 'shared-my';

import { type ICurrentUserData } from './current-user.schema';
import { type IPermissions, Permissions } from '../permissions';

export interface ICurrentUser {
    data: ICurrentUserData;
    permissions: IPermissions;
    status: {
        demining: APPROVE_STATUS | null;
    };
}

export class CurrentUser implements ICurrentUser {
    data: ICurrentUserData;
    permissions: IPermissions;

    constructor(data: ICurrentUserData) {
        this.data = data;
        this.permissions = new Permissions(this);

        makeAutoObservable(this);
    }

    get deminingStatus() {
        if (!this.data.id) {
            return null;
        }

        if (!!this.data.id && !this.permissions.demining.view()) {
            return APPROVE_STATUS.PENDING;
        }

        if (!!this.data.id && !!this.permissions.demining.view()) {
            return APPROVE_STATUS.CONFIRMED;
        }

        return null;
    }

    get status() {
        return {
            demining: this.deminingStatus,
        };
    }
}
