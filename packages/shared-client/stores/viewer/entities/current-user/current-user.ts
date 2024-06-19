import { ROLES } from '@/shared/db';
import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import { type ICurrentUserValue, type ICurrentUserOrganizationValue } from './current-user.schema';

export interface ICurrentUser extends ICurrentUserValue {
    isRootAdmin: boolean;
    isOrganizationAdmin: boolean;
    isOrganizationMember: boolean;
    isAuthorized: boolean;
    isWaitingApproved: boolean;
}

export class CurrentUser implements ICurrentUser {
    id: string;
    roles: ROLES[];
    email: string;
    organization: ICurrentUserOrganizationValue | null;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: ICurrentUserValue) {
        this.id = value.id;
        this.roles = value.roles;
        this.email = value.email;
        this.organization = value.organization;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;

        makeAutoObservable(this);
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
