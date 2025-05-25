import { makeAutoObservable } from 'mobx';
import { type APPROVE_STATUS, ROLES } from 'shared-my';

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
}
export interface IPermissionAmmo extends IPermission {
    viewManagement: (params?: Params) => boolean;
    createManagement: (params?: Params) => boolean;
    editManagement: (params?: Params) => boolean;
    removeManagement: (params?: Params) => boolean;
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

    isAuthor(authorId?: string) {
        return this.userId === authorId;
    }

    isAutorized() {
        return !!this.userId;
    }

    isMember(id?: string) {
        if (!id) {
            return !!this.parent.user?.data.organization?.id;
        }

        return this.parent.user?.data.organization?.id === id;
    }

    get userId() {
        return this.parent?.user?.data.id;
    }

    get dictionary() {
        return {
            view: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN) || this.hasRole(ROLES.AMMO_AUTHOR),
            viewManagement: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN),
            create: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN) || this.hasRole(ROLES.AMMO_AUTHOR),
            createManagement: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN),
            edit: (params?: Params) => {
                const { authorId } = params || {};
                return this.hasRole(ROLES.AMMO_CONTENT_ADMIN) || (this.hasRole(ROLES.AMMO_AUTHOR) && this.isAuthor(authorId));
            },
            editManagement: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN),
            approve: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN),
            remove: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN),
            removeManagement: () => this.hasRole(ROLES.AMMO_CONTENT_ADMIN),
        };
    }

    get documents() {
        return {
            view: () => this.hasRole(ROLES.DEMINING_VIEWER) && this.isAutorized(),
            viewManagement: () => this.hasRole(ROLES.ORGANIZATION_ADMIN),
            create: () => this.hasRole(ROLES.ORGANIZATION_ADMIN),
            edit: () => this.hasRole(ROLES.ORGANIZATION_ADMIN),
            remove: () => this.hasRole(ROLES.ORGANIZATION_ADMIN),
        };
    }

    get managment() {
        return {
            view: () => this.hasRole(ROLES.ROOT_ADMIN),
            viewOrganization: () => this.hasRole(ROLES.ORGANIZATION_ADMIN) && !!this.isMember(),
            create: () => this.hasRole(ROLES.ROOT_ADMIN),
            edit: () => this.hasRole(ROLES.ROOT_ADMIN),
            editRoles: () => this.hasRole(ROLES.ROOT_ADMIN),
            remove: () => this.hasRole(ROLES.ROOT_ADMIN),
        };
    }
}
