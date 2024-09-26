import { removeFields, ROLES } from 'shared-my';
import { type IUserDB, type IOrganizationDB } from 'shared-my';

import { type IQuery, type IDBBase } from '~/common';

import { type IOrganizationDTO, type IUserDTO, type ICreateOrganizationDTO } from '../dto';

export interface IOrganizationAPI {
    create: (value: Pick<ICreateOrganizationDTO, 'name'>) => Promise<IOrganizationDTO>;
    update: (id: string, value: ICreateOrganizationDTO) => Promise<Omit<IOrganizationDTO, 'members'>>;
    updateMember: (
        organizationId: string,
        userId: string,
        permissions: { isAdmin: boolean; isAuthor: boolean },
        isRootAdmin: boolean,
    ) => Promise<IUserDTO>;
    removeMember: (organizationId: string, userId: string) => Promise<void>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IOrganizationDTO[]>;
    get: (id: string) => Promise<IOrganizationDTO | null>;
    getMembers: (id: string) => Promise<IUserDTO[]>;
    exist: (id: string) => Promise<boolean>;
}

export class OrganizationAPI {
    constructor(
        private db: {
            organization: IDBBase<IOrganizationDB>;
            user: IDBBase<IUserDB>;
        },
    ) {}

    create = async (value: Pick<ICreateOrganizationDTO, 'name'>): Promise<IOrganizationDTO> => {
        const res = await this.db.organization.create({
            ...value,
            membersIds: [],
        });

        removeFields(res, 'membersIds');

        return res;
    };

    private getRoles(user: IUserDB, permissions: { isAdmin: boolean; isAuthor: boolean }) {
        let roles = user.roles.includes(ROLES.ROOT_ADMIN) ? [ROLES.ROOT_ADMIN] : [];

        if (permissions.isAdmin) {
            roles.push(ROLES.ORGANIZATION_ADMIN);
        } else {
            roles = roles.filter((el) => el !== ROLES.ORGANIZATION_ADMIN);
        }

        if (permissions.isAuthor) {
            roles.push(ROLES.AUTHOR);
        } else {
            roles = roles.filter((el) => el !== ROLES.AUTHOR);
        }

        return roles;
    }

    update = async (id: string, value: ICreateOrganizationDTO): Promise<Omit<IOrganizationDTO, 'members'>> => {
        const res = await this.db.organization.update(id, value);
        removeFields(res, 'membersIds');
        return res;
    };

    updateMember = async (
        organizationId: string,
        userId: string,
        permissions: { isAdmin: boolean; isAuthor: boolean },
        isRootAdmin: boolean,
    ): Promise<IUserDTO> => {
        const [organization, user] = await Promise.all([
            this.db.organization.get(organizationId),
            this.db.user.get(userId) as Promise<IUserDTO>,
        ]);

        const membersIds = organization?.membersIds ?? [];

        const roles = this.getRoles(user, permissions);

        await Promise.all([
            this.db.organization.update(organizationId, {
                membersIds: membersIds.includes(userId) ? membersIds : [...membersIds, userId],
            }),
            this.db.user.update(userId, {
                organizationId,
                ...(isRootAdmin ? { roles } : {}),
            }),
        ]);

        return { ...user, roles, organizationId };
    };

    removeMember = async (organizationId: string, userId: string): Promise<void> => {
        const [organization, user] = await Promise.all([
            this.db.organization.get(organizationId) as Promise<IOrganizationDB>,
            this.db.user.get(userId) as Promise<IUserDB>,
        ]);

        await Promise.all([
            this.db.organization.update(organizationId, {
                membersIds: organization.membersIds.filter((el) => el !== userId),
            }),
            this.db.user.update(userId, {
                organizationId: null,
                roles: user.roles.filter((el) => el !== ROLES.ORGANIZATION_ADMIN),
            }),
        ]);
    };

    remove = (id: string) => this.db.organization.remove(id);

    getList = async (query?: IQuery): Promise<IOrganizationDTO[]> => {
        const organizations = await this.db.organization.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
        return organizations.map((organization) => {
            removeFields(organization, 'membersIds');
            return organization;
        });
    };

    get = async (id: string): Promise<IOrganizationDTO | null> => {
        const res = await this.db.organization.get(id);

        if (!res) throw new Error('There is no organization with id');

        removeFields(res, 'membersIds');

        return res;
    };

    getMembers = async (id: string): Promise<IUserDTO[]> => {
        const res = await this.db.user.select({
            where: {
                organizationId: id,
            },
        });

        if (!res) {
            return [];
        }

        return res;
    };

    exist = (id: string): Promise<boolean> => this.db.organization.exist('id', id);
}
