import { makeAutoObservable } from 'mobx';
import { ROLES } from 'shared-my';

import { type ICurrentUserData } from './current-user.schema';

export interface ICurrentUser {
    data: ICurrentUserData;
    isRootAdmin: boolean;
    isOrganizationAdmin: boolean;
    isOrganizationMember: boolean;
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
    get isOrganizationMember() {
        return !!this.data.organization;
    }
    get isAuthorizedDSNS() {
        return !!this.isRootAdmin || !!this.isOrganizationAdmin || !!this.isOrganizationMember;
    }
    get isWaitingApproved() {
        return !!this.data.id && !this.data.organization;
    }
    get isAuthorizedAmmo() {
        return !!this.data;
    }
}
