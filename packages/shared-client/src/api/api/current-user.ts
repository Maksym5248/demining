import { type IUserInfoDB, type IMemberDB, type IOrganizationDB, type IUserAccessDB } from 'shared-my';

import { type IDBBase, type IUpdateValue } from '~/common';
import { type IAssetStorage } from '~/services';
import { type ICurrentUserInfoUpdate } from '~/stores';

import { type ICurrentUserDTO, type IUserOrganizationDTO } from '../dto';

export interface ICurrentUserAPI {
    updateInfo: (id: string, value: IUpdateValue<ICurrentUserInfoUpdate>) => Promise<IUserInfoDB>;
    get: (id: string) => Promise<ICurrentUserDTO | null>;
    setOrganization: (id: string) => void;
    removeOrganization: () => void;
}

export class CurrentUserAPI {
    constructor(
        private db: {
            userInfo: IDBBase<IUserInfoDB>;
            userAccess: IDBBase<IUserAccessDB>;
            member: IDBBase<IMemberDB>;
            organization?: IDBBase<IOrganizationDB>;
            setOrganizationId: (id: string) => void;
            removeOrganizationId: () => void;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {}

    getUserOrganization = async (userId: string): Promise<IUserOrganizationDTO | null> => {
        if (!userId) {
            return null;
        }

        const member = await this.db.member?.get(userId);

        if (!member?.organizationId) {
            return null;
        }

        const res = await this.db.organization?.get(member?.organizationId);

        return res ?? null;
    };

    updateInfo = async (id: string, value: IUpdateValue<ICurrentUserInfoUpdate>): Promise<IUserInfoDB> => {
        return this.db.userInfo.update(id, value);
    };

    get = async (id: string): Promise<ICurrentUserDTO | null> => {
        const [info, access, member, organization] = await Promise.all([
            this.db.userInfo.get(id),
            this.db.userAccess.get(id),
            this.db.member.get(id),
            this.getUserOrganization(id),
        ]);

        if (!info || !access || !member) {
            throw new Error('There is no user with id');
        }

        return {
            id: info.id,
            info,
            access,
            member,
            organization,
        };
    };

    setOrganization = async (id: string) => {
        this.services.assetStorage.setOrganizationId(id);
        this.db.setOrganizationId(id);
    };
    removeOrganization = () => {
        this.services.assetStorage.removeOrganizationId();
        this.db.removeOrganizationId();
    };
}
