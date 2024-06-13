import { ROLES } from '~/constants';

import { type ICurrentUserValue, CurrentUserValue } from './current-user.schema';

export interface ICurrentUser extends ICurrentUserValue {
    isRootAdmin: boolean;
    isOrganizationAdmin: boolean;
    isOrganizationMember: boolean;
    isAuthorized: boolean;
    isWaitingApproved: boolean;
}

export class CurrentUser extends CurrentUserValue implements ICurrentUser {
    constructor(value: ICurrentUserValue) {
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
