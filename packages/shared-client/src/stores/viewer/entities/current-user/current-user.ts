import { makeAutoObservable } from 'mobx';
import { ROLES } from 'shared-my/db';

import { type ICurrentUserData } from './current-user.schema';

export interface ICurrentUser {
    data: ICurrentUserData;
    isRootAdmin: boolean;
    isOrganizationAdmin: boolean;
    isOrganizationMember: boolean;
    isAuthorized: boolean;
    isWaitingApproved: boolean;
}

export class CurrentUser implements ICurrentUser {
    data: ICurrentUserData;

    constructor(data: ICurrentUserData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get isRootAdmin() {
        return this.data.roles.includes(ROLES.ROOT_ADMIN);
    }
    get isOrganizationAdmin() {
        return this.data.roles.includes(ROLES.ORGANIZATION_ADMIN) && !!this.data.organization;
    }
    get isOrganizationMember() {
        return !!this.data.organization;
    }
    get isAuthorized() {
        return !!this.isRootAdmin || !!this.isOrganizationAdmin || !!this.isOrganizationMember;
    }
    get isWaitingApproved() {
        return !!this.data.id && !this.data.organization;
    }
}
