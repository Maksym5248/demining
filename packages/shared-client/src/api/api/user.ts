import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import { removeFields } from 'shared-my/common';
import { type IOrganizationDB, type IUserDB } from 'shared-my/db';

import { type IQuery, type IDBBase, type IUpdateValue } from '~/common';
import { type IAssetStorage } from '~/services';

import { type IUserDTO, type ICurrentUserDTO, type IUserOrganizationDTO } from '../dto';

export interface IUserAPI {
    update: (id: string, value: IUpdateValue<ICurrentUserDTO>) => Promise<ICurrentUserDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<ICurrentUserDTO[]>;
    getListUnassignedUsers: (query?: IQuery) => Promise<IUserDTO[]>;
    get: (id: string) => Promise<ICurrentUserDTO | null>;
    exist: (id: string) => Promise<boolean>;
    setOrganization: (id: string) => void;
    removeOrganization: () => void;
}

export class UserAPI {
    constructor(
        private db: {
            user: IDBBase<IUserDB>;
            organization: IDBBase<IOrganizationDB>;
            setOrganizationId: (id: string) => void;
            removeOrganizationId: () => void;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {}

    getIds = <T>(arr: T[], key: string) => uniq(map(arr, key).filter((el) => !!el)) as string[];

    getUserOrganization = async (user: IUserDB | null): Promise<IUserOrganizationDTO | null> => {
        if (!user || !user?.organizationId) {
            return null;
        }

        const res = await this.db.organization.get(user.organizationId);

        if (!res) {
            return null;
        }

        removeFields(res, 'membersIds');

        return res;
    };

    update = async (id: string, value: IUpdateValue<ICurrentUserDTO>): Promise<ICurrentUserDTO> => {
        const res = await this.db.user.update(id, value);

        const organization = await this.getUserOrganization(res);
        removeFields(res, 'organizationId');

        return {
            ...res,
            organization,
        };
    };

    remove = (id: string) => this.db.user.remove(id);

    getList = async (query?: IQuery): Promise<ICurrentUserDTO[]> => {
        const users = await this.db.user.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

        const organizationIds = this.getIds(users, 'organizationId');

        const organizations = (await Promise.all(
            organizationIds.map((organizationId) => this.db.organization.get(organizationId)),
        )) as IOrganizationDB[];

        const collection = keyBy(organizations, 'id');

        return users.map(({ organizationId, ...restUser }) => ({
            ...restUser,
            organization: organizationId ? collection[organizationId] : null,
        }));
    };

    getListUnassignedUsers = (query?: IQuery): Promise<IUserDTO[]> =>
        this.db.user.select({
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

    get = async (id: string): Promise<ICurrentUserDTO | null> => {
        const res = await this.db.user.get(id);

        if (!res) return null;

        const organization = await this.getUserOrganization(res);

        removeFields(res, 'organizationId');

        return {
            ...res,
            organization,
        };
    };

    exist = (id: string): Promise<boolean> => this.db.user.exist('id', id);

    setOrganization = async (id: string) => {
        this.services.assetStorage.setOrganizationId(id);
        this.db.setOrganizationId(id);
    };
    removeOrganization = () => {
        this.services.assetStorage.removeOrganizationId();
        this.db.removeOrganizationId();
    };
}
