import { makeAutoObservable } from 'mobx';
import { APPROVE_STATUS, ROLES } from 'shared-my';

import { type ICurrentUserData } from '../current-user/current-user.schema';

interface Params {
    authorId?: string;
    status?: APPROVE_STATUS;
}

export interface IPermission {
    view: (params?: Params) => boolean;
    create: (params?: Params) => boolean;
    edit: (params?: Params) => boolean;
    remove: (params?: Params) => boolean;
}

export interface IPermissionDemining extends IPermission {
    viewManagement: () => boolean;
    edit: (params?: Params) => boolean;
}
export interface IPermissionAmmo extends IPermission {
    viewManagement: () => boolean;
    approve: (params?: Params) => boolean;
}

export interface IPermissionManagment extends IPermission {
    viewOrganization: () => boolean;
    editRoles: (params?: Params) => boolean;
}

export interface IPermissions {
    dictionary: IPermissionAmmo;
    documents: IPermissionDemining;
    managment: IPermissionManagment;
}

export class Permissions implements IPermissions {
    constructor(private parent: { user: { data: ICurrentUserData } | null; hasRole: (role: ROLES) => boolean }) {
        makeAutoObservable(this);
    }

    hasRole(role: ROLES) {
        return this.parent.hasRole(role);
    }

    get userId() {
        return this.parent?.user?.data.id;
    }

    get dictionary() {
        return {
            view: () => this.hasRole(ROLES.AMMO_VIEWER),
            viewManagement: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN) || this.hasRole(ROLES.ORGANIZATION_ADMIN),
            create: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN),
            edit: (params?: Params) => {
                const { authorId, status } = params || {};

                return this.hasRole(ROLES.AMMO_CONTENT_ADMIN) || (authorId === this.userId && status !== APPROVE_STATUS.CONFIRMED);
            },
            approve: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN),
            remove: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN),
        };
    }

    get documents() {
        return {
            view: () => this.hasRole(ROLES.DEMINING_VIEWER) && !!this.userId,
            viewManagement: () => this.hasRole(ROLES.ORGANIZATION_ADMIN),
            create: () => this.hasRole(ROLES.ORGANIZATION_ADMIN),
            edit: () => this.hasRole(ROLES.ORGANIZATION_ADMIN),
            remove: () => this.hasRole(ROLES.ORGANIZATION_ADMIN),
        };
    }

    get managment() {
        return {
            view: () => this.hasRole(ROLES.ROOT_ADMIN),
            viewOrganization: () => !!this.parent.user?.data.organization?.id && this.hasRole(ROLES.ORGANIZATION_ADMIN),
            create: () => this.hasRole(ROLES.ROOT_ADMIN),
            edit: () => this.hasRole(ROLES.ROOT_ADMIN),
            editRoles: () => this.hasRole(ROLES.ROOT_ADMIN),
            remove: () => this.hasRole(ROLES.ROOT_ADMIN),
        };
    }
}
