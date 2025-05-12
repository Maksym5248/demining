import { type IUserInfoDB, type IMemberDB, type IOrganizationDB, type IUserAccessDB } from 'shared-my';

import { type IQuery, type IDBRemote } from '~/common';

import { type IUpdateUserDTO, type IUserDTO } from '../dto';

export interface IUserAPI {
    update: (id: string, value: IUpdateUserDTO) => Promise<IUserDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IUserDTO[]>;
    get: (id: string) => Promise<IUserDTO>;
    exist: (id: string) => Promise<boolean>;
}

export class UserAPI {
    constructor(
        private db: {
            userInfo: IDBRemote<IUserInfoDB>;
            userAccess: IDBRemote<IUserAccessDB>;
            member: IDBRemote<IMemberDB>;
            organization?: IDBRemote<IOrganizationDB>;
            batchStart: () => void;
            batchCommit: () => Promise<void>;
        },
    ) {}

    update = async (id: string, value: IUpdateUserDTO): Promise<IUserDTO> => {
        this.db.batchStart();

        !!value.info && this.db.userInfo.batchUpdate(id, value.info);
        !!value.access && this.db.userAccess.batchUpdate(id, value.access);
        !!value.member && this.db.member.batchUpdate(id, value.member);

        await this.db.batchCommit();

        return this.get(id);
    };

    remove = async (id: string) => {
        this.db.batchStart();

        this.db.userInfo.batchRemove(id);
        this.db.userAccess.batchRemove(id);
        this.db.member.batchRemove(id);

        await this.db.batchCommit();

        return id;
    };

    getList = async (query?: IQuery): Promise<IUserDTO[]> => {
        const members = await this.db.member.select({
            ...(query ?? {}),
            order: {
                by: 'createdAt',
                type: 'desc',
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

    get = async (id: string): Promise<IUserDTO> => {
        const [info, access, member] = await Promise.all([this.db.userInfo.get(id), this.db.userAccess.get(id), this.db.member.get(id)]);

        if (!info || !access || !member) {
            throw new Error('There is no user with id');
        }

        return {
            id: info.id,
            info,
            access,
            member,
        };
    };

    exist = (id: string): Promise<boolean> => this.db.userInfo.exist('id', id);
}
