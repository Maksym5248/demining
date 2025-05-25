import {
    type IMemberDB,
    type IUserAccessDB,
    type IUserInfoDB,
    type IBaseDB,
    ROLES,
} from 'shared-my';

export interface IUserV1 extends IBaseDB {
    email: string;
    roles: string[];
    organizationId?: string | null;
}

export const v1Tov2 = (
    prev: IUserV1,
): {
    access: IUserAccessDB;
    info: IUserInfoDB;
    member: IMemberDB;
} => {
    const common = {
        id: prev.id,
        createdAt: prev.createdAt,
        updatedAt: prev.updatedAt,
    } as IBaseDB;

    const info = {
        name: '',
        photoUri: '',
        ...common,
        _search: prev?._search ?? [],
    };

    const access = {
        ...common,
        email: prev.email,
        [ROLES.ROOT_ADMIN]: prev.roles.includes('ROOT_ADMIN'),
        [ROLES.ORGANIZATION_ADMIN]: prev.roles.includes('ORGANIZATION_ADMIN'),
        [ROLES.AMMO_CONTENT_ADMIN]: prev.roles.includes('AMMO_CONTENT_ADMIN'),
        [ROLES.AMMO_AUTHOR]: prev.roles.includes('AMMO_AUTHOR'),
        [ROLES.AMMO_VIEWER]: true,
        [ROLES.DEMINING_VIEWER]: true,
    };

    const member = {
        ...common,
        organizationId: prev.organizationId ?? null,
    };

    return {
        info,
        access,
        member,
    };
};
