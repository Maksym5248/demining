import { makeAutoObservable } from 'mobx';
import { APPROVE_STATUS, ROLES } from 'shared-my';

import { type ICurrentUserData } from '../current-user/current-user.schema';

interface Params {
    authorId?: string;
    status?: APPROVE_STATUS;
    roles?: ROLES[];
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
    viewManagement: () => boolean;
    approve: (params?: Params) => boolean;
}

export interface IPermissions {
    ammo: IPermissionAmmo;
    demining: IPermissionDemining;
    managment: IPermission;
}

export class Permissions implements IPermissions {
    constructor(private user: { data: ICurrentUserData }) {
        makeAutoObservable(this);
    }

    get ammo() {
        const { roles } = this.user.data;

        return {
            view: () => roles.includes(ROLES.AMMO_VIEWER),
            viewManagement: () => roles.includes(ROLES.AMMO_CONTENT_ADMIN),
            create: () => roles.includes(ROLES.AMMO_CONTENT_ADMIN),
            edit: (params?: Params) => {
                const { authorId, status } = params || {};

                return roles.includes(ROLES.AMMO_CONTENT_ADMIN) || (authorId === this.user.data.id && status !== APPROVE_STATUS.CONFIRMED);
            },
            approve: () => roles.includes(ROLES.AMMO_CONTENT_ADMIN),
            remove: () => roles.includes(ROLES.AMMO_CONTENT_ADMIN),
        };
    }

    get demining() {
        const { roles } = this.user.data;

        return {
            view: () => roles.includes(ROLES.DEMINING_VIEWER) && !!this.user.data.organization?.id,
            viewManagement: () => roles.includes(ROLES.ORGANIZATION_ADMIN),
            create: () => roles.includes(ROLES.ORGANIZATION_ADMIN),
            edit: () => roles.includes(ROLES.ORGANIZATION_ADMIN),
            remove: () => roles.includes(ROLES.ORGANIZATION_ADMIN),
        };
    }

    get managment() {
        const { roles } = this.user.data;

        return {
            view: () => roles.includes(ROLES.ROOT_ADMIN),
            create: () => roles.includes(ROLES.ROOT_ADMIN),
            edit: () => roles.includes(ROLES.ROOT_ADMIN),
            remove: () => roles.includes(ROLES.ROOT_ADMIN),
        };
    }
}
