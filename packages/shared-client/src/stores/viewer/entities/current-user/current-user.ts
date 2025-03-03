import { makeAutoObservable } from 'mobx';
import { ROLES } from 'shared-my';

import { type ICurrentUserData } from './current-user.schema';

export interface ICurrentUser {
    data: ICurrentUserData;
    isRootAdmin: boolean;
    isContentAdmin: boolean;
    isOrganizationAdmin: boolean;
    isOrganizationMember: boolean;
    isAuthor: boolean;
    isAuthorizedDSNS: boolean;
    isAuthorizedAmmo: boolean;
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

    get isContentAdmin() {
        return this.data.roles.includes(ROLES.ROOT_ADMIN);
    }

    get isAuthor() {
        return this.data.roles.includes(ROLES.AUTHOR);
    }

    get isOrganizationMember() {
        return !!this.data.organization;
    }

    get isAuthorizedDSNS() {
        return !!this.isRootAdmin || !!this.isOrganizationAdmin || !!this.isOrganizationMember || !!this.isAuthor || !!this.isContentAdmin;
    }
    get isWaitingApproved() {
        return !!this.data.id && !this.data.organization && !this.isAuthor && !this.isRootAdmin && !this.isContentAdmin;
    }

    get isAuthorizedAmmo() {
        return !!this.data;
    }
}
