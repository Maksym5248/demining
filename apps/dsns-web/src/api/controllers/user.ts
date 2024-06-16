import { type IOrganizationDB, type IQuery, type IUserDB } from '@/shared';
import { type UpdateValue } from '@/shared-client';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

import { DB } from '~/db';
import { AssetStorage } from '~/services';
import { removeFields } from '~/utils';

import { type ICurrentUserDTO, type IUserDTO, type IUserOrganizationDTO } from '../types';

const getIds = <T>(arr: T[], key: string) => uniq(map(arr, key).filter((el) => !!el)) as string[];

const getUserOrganization = async (user: IUserDB | null): Promise<IUserOrganizationDTO | null> => {
    if (!user || !user?.organizationId) {
        return null;
    }

    const res = await DB.organization.get(user.organizationId);

    if (!res) {
        return null;
    }

    removeFields(res, 'membersIds');

    return res;
};

const update = async (id: string, value: UpdateValue<ICurrentUserDTO>): Promise<ICurrentUserDTO> => {
    const res = await DB.user.update(id, value);

    const organization = await getUserOrganization(res);
    removeFields(res, 'organizationId');

    return {
        ...res,
        organization,
    };
};

const remove = (id: string) => DB.user.remove(id);

const getList = async (query?: IQuery): Promise<ICurrentUserDTO[]> => {
    const users = await DB.user.select({
        order: {
            by: 'createdAt',
            type: 'desc',
        },
        ...(query ?? {}),
    });

    const organizationIds = getIds(users, 'organizationId');

    const organizations = (await Promise.all(
        organizationIds.map((organizationId) => DB.organization.get(organizationId)),
    )) as IOrganizationDB[];

    const collection = keyBy(organizations, 'id');

    return users.map(({ organizationId, ...restUser }) => ({
        ...restUser,
        organization: organizationId ? collection[organizationId] : null,
    }));
};

const getListUnassignedUsers = (query?: IQuery): Promise<IUserDTO[]> =>
    DB.user.select({
        ...(query ?? {}),
        order: {
            by: 'createdAt',
            type: 'desc',
        },
        where: {
            organizationId: null,
            ...(query?.where ?? {}),
        },
    });

const get = async (id: string): Promise<ICurrentUserDTO | null> => {
    const res = await DB.user.get(id);

    if (!res) return null;

    const organization = await getUserOrganization(res);

    removeFields(res, 'organizationId');

    return {
        ...res,
        organization,
    };
};

const exist = (id: string): Promise<boolean> => DB.user.exist('id', id);

const setOrganization = async (id: string) => {
    AssetStorage.setOrganizationId(id);
    DB.setOrganizationId(id);
};
const removeOrganization = () => {
    AssetStorage.removeOrganizationId();
    DB.removeOrganizationId();
};

export const user = {
    update,
    remove,
    get,
    getList,
    exist,
    getListUnassignedUsers,
    setOrganization,
    removeOrganization,
};
