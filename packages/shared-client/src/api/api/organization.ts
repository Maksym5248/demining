import { type IMemberDB, type IUserInfoDB, type IOrganizationDB, type IUserAccessDB } from 'shared-my';

import { type IQuery, type IDBBase } from '~/common';

import { type IOrganizationDTO, type IUserDTO, type ICreateOrganizationDTO } from '../dto';

export interface IOrganizationAPI {
    create: (value: Pick<ICreateOrganizationDTO, 'name'>) => Promise<IOrganizationDTO>;
    update: (id: string, value: ICreateOrganizationDTO) => Promise<IOrganizationDTO>;
    addMember: (organizationId: string, userId: string) => Promise<IUserDTO>;
    removeMember: (organizationId: string, userId: string) => Promise<void>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IOrganizationDTO[]>;
    get: (id: string) => Promise<IOrganizationDTO | null>;
    getMembers: (id: string) => Promise<IUserDTO[]>;
    exist: (id: string) => Promise<boolean>;
}

// TODO: користувач не повинен бути доданий до вох організацій одночасно
// 1. створити додатко CurrentUserAPI для використання користувачем
// 2. User api оновити або додати/видалити роль
// 3. Список учасників без організації
// 4. Може створити таблицю для з'єднання організації та учасників ??
// 5. зробити необовязковим повернення після оновлення чи створення (створює зайві запити)

export class OrganizationAPI {
    constructor(
        private db: {
            organization: IDBBase<IOrganizationDB>;
            userInfo: IDBBase<IUserInfoDB>;
            userAccess: IDBBase<IUserAccessDB>;
            member: IDBBase<IMemberDB>;
        },
    ) {}

    create = async (value: Pick<ICreateOrganizationDTO, 'name'>): Promise<IOrganizationDTO> => {
        return this.db.organization.create(value);
    };

    update = async (id: string, value: ICreateOrganizationDTO): Promise<IOrganizationDTO> => {
        return this.db.organization.update(id, value);
    };

    addMember = async (organizationId: string, userId: string): Promise<IUserDTO> => {
        const [info, access, member, organization] = await Promise.all([
            this.db.userInfo.get(userId),
            this.db.userAccess.get(userId),
            this.db.member.get(userId),
            this.db.organization.get(organizationId),
        ]);

        if (!info || !access || !member) {
            throw new Error('There is no user with id');
        }

        if (!organization) {
            throw new Error('There is no organization with id');
        }

        await this.db.member.update(userId, {
            organizationId,
        });

        return {
            id: info.id,
            info,
            access,
            member,
        };
    };

    removeMember = async (organizationId: string, userId: string): Promise<void> => {
        const [member, organization] = await Promise.all([this.db.member.get(userId), this.db.organization.get(organizationId)]);

        if (!member) {
            throw new Error('User not in any organization');
        }

        if (!organization) {
            throw new Error('There is no organization with id');
        }

        await this.db.member.update(userId, {
            organizationId: null,
        });
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

        return organizations;
    };

    get = async (id: string): Promise<IOrganizationDTO | null> => {
        const res = await this.db.organization.get(id);

        if (!res) throw new Error('There is no organization with id');

        return res;
    };

    getMembers = async (organizationId: string): Promise<IUserDTO[]> => {
        const members = await this.db.member.select({
            where: {
                organizationId,
            },
        });

        const [info, access] = await Promise.all([
            this.db.userInfo.getByIds(members.map(item => item.id)),
            this.db.userAccess.getByIds(members.map(item => item.id)),
        ]);

        const infoMap = new Map(info.map(item => [item.id, item]));
        const accessMap = new Map(access.map(item => [item.id, item]));

        return members.map(member => {
            return {
                id: member.id,
                info: infoMap.get(member.id) ?? ({} as IUserInfoDB),
                access: accessMap.get(member.id) ?? ({} as IUserAccessDB),
                member,
            };
        });
    };

    exist = (id: string): Promise<boolean> => this.db.organization.exist('id', id);
}
