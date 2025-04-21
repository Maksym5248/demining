import { type IUserAccessDB, type IBaseDB, type ROLES } from 'shared-my';

export interface IUserAccessV1 extends Omit<IBaseDB, 'organizationId'> {
    roles: Partial<Record<ROLES, boolean>>;
}

export const v2Tov3 = (
    prev: IUserAccessV1,
): {
    access: IUserAccessDB;
} => {
    const access = {
        ...prev,
        ...prev.roles,
    };

    if (access.roles) {
        // @ts-ignore
        delete access.roles;
    }

    return { access };
};
