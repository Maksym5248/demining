import { ROLES } from '~/constants';

import { IUserValue, UserValue } from './user.schema';

export interface IUser extends IUserValue {
    isRootAdmin: boolean;
    isOrganizationAdmin: boolean;
    isOrganizationMember: boolean;
}

export class User extends UserValue implements IUser {
    constructor(value: IUserValue) {
        super(value);
    }

    get isRootAdmin() {
        return this.roles.includes(ROLES.ROOT_ADMIN);
    }
    get isOrganizationAdmin() {
        return this.roles.includes(ROLES.ORGANIZATION_ADMIN) && !!this.organizationId;
    }
    get isOrganizationMember() {
        return !!this.organizationId;
    }
}
