import { makeAutoObservable } from 'mobx';
import { ROLES } from 'shared-my/db';

import { type IUserData } from './user.schema';

export interface IUser {
    id: string;
    data: IUserData;
    isRootAdmin: boolean;
    isOrganizationAdmin: boolean;
    isOrganizationMember: boolean;
}

export class User implements IUser {
    data: IUserData;

    constructor(data: IUserData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get isRootAdmin() {
        return this.data.roles.includes(ROLES.ROOT_ADMIN);
    }
    get isOrganizationAdmin() {
        return this.data.roles.includes(ROLES.ORGANIZATION_ADMIN) && !!this.data.organizationId;
    }
    get isOrganizationMember() {
        return !!this.data.organizationId;
    }
}
