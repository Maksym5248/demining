import { ROLES } from '~/constants';

import { IUserValue, UserValue } from './current-user.schema';

export interface ICurrentUser extends IUserValue {
    isRootAdmin: boolean;
    isOrganizationAdmin: boolean;
    isOrganizationMember: boolean;
    isAuthorized: boolean;
    isWaitingApproved: boolean;
}

export class CurrentUser extends UserValue implements ICurrentUser {
    constructor(value: IUserValue) {
        super(value);
    }

    get isRootAdmin() {
        return this.roles.includes(ROLES.ROOT_ADMIN);
    }
    get isOrganizationAdmin() {
        return this.roles.includes(ROLES.ORGANIZATION_ADMIN) && !!this.organization;
    }
    get isOrganizationMember() {
        return !!this.organization;
    }
    get isAuthorized() {
        return !!this.isRootAdmin || !!this.isOrganizationAdmin || !!this.isOrganizationMember;
    }
    get isWaitingApproved() {
        return !!this.id && !this.organization;
    }
}
