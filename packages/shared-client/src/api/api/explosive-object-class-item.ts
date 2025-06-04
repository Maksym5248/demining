import { type IExplosiveObjectClassItemDB } from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBRemote, type IQuery, type ISubscriptionDocument, type IDBLocal } from '~/common';
import { type ILogger, type IStorage } from '~/services';

import { type IExplosiveObjectClassItemDTO } from '../dto';
import { DBOfflineFirst, type IDBOfflineFirst } from '../offline';

export interface IExplosiveObjectClassItemAPI {
    create: (value: ICreateValue<IExplosiveObjectClassItemDTO>) => Promise<IExplosiveObjectClassItemDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectClassItemDTO>) => Promise<IExplosiveObjectClassItemDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectClassItemDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectClassItemDTO>;
    sync: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveObjectClassItemDTO>[]) => void) => Promise<void>;
}

interface IServices {
    logger: ILogger;
    storage: IStorage;
}
export class ExplosiveObjectClassItemAPI implements IExplosiveObjectClassItemAPI {
    offline: IDBOfflineFirst<IExplosiveObjectClassItemDB>;

    constructor(
        dbRemote: {
            explosiveObjectClassItem: IDBRemote<IExplosiveObjectClassItemDB>;
        },
        dbLocal: {
            explosiveObjectClassItem: IDBLocal<IExplosiveObjectClassItemDB>;
        },
        serices: IServices,
    ) {
        this.offline = new DBOfflineFirst<IExplosiveObjectClassItemDB>(
            dbRemote.explosiveObjectClassItem,
            dbLocal.explosiveObjectClassItem,
            serices,
        );
    }

    create = async (value: ICreateValue<IExplosiveObjectClassItemDTO>): Promise<IExplosiveObjectClassItemDTO> => {
        const res = await this.offline.create(value);
        return res;
    };

    update = async (id: string, value: IUpdateValue<IExplosiveObjectClassItemDTO>): Promise<IExplosiveObjectClassItemDTO> => {
        const explosiveObject = await this.offline.update(id, value);

        if (!explosiveObject) throw new Error('there is data by id');

        return explosiveObject;
    };

    remove = (id: string) => this.offline.remove(id);

    getList(query?: IQuery): Promise<IExplosiveObjectClassItemDTO[]> {
        return this.offline.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
    }

    get = async (id: string): Promise<IExplosiveObjectClassItemDTO> => {
        const res = await this.offline.get(id);
        if (!res) throw new Error('there is item with id');
        return res;
    };

    sync = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveObjectClassItemDTO>[]) => void) => {
        return this.offline.sync(args, callback);
    };
}
