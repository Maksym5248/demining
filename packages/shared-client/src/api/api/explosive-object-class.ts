import { type IExplosiveObjectClassDB } from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBRemote, type IQuery, type ISubscriptionDocument, type IDBLocal } from '~/common';

import { type IExplosiveObjectClassDTO } from '../dto';
import { DBOfflineFirst, type IDBOfflineFirst } from '../offline';

export interface IExplosiveObjectClassAPI {
    create: (value: ICreateValue<IExplosiveObjectClassDTO>) => Promise<IExplosiveObjectClassDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectClassDTO>) => Promise<IExplosiveObjectClassDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectClassDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectClassDTO>;
    subscribe: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveObjectClassDTO>[]) => void) => Promise<void>;
}

export class ExplosiveObjectClassAPI implements IExplosiveObjectClassAPI {
    offline: IDBOfflineFirst<IExplosiveObjectClassDB>;

    constructor(
        dbRemote: {
            explosiveObjectClass: IDBRemote<IExplosiveObjectClassDB>;
        },
        dbLocal: {
            explosiveObjectClass: IDBLocal<IExplosiveObjectClassDB>;
        },
    ) {
        this.offline = new DBOfflineFirst<IExplosiveObjectClassDB>(dbRemote.explosiveObjectClass, dbLocal.explosiveObjectClass);
    }

    create = async (value: ICreateValue<IExplosiveObjectClassDTO>): Promise<IExplosiveObjectClassDTO> => {
        const res = await this.offline.create(value);
        return res;
    };

    update = async (id: string, value: IUpdateValue<IExplosiveObjectClassDTO>): Promise<IExplosiveObjectClassDTO> => {
        const explosiveObject = await this.offline.update(id, value);

        if (!explosiveObject) throw new Error('there is data by id');

        return explosiveObject;
    };

    remove = (id: string) => this.offline.remove(id);

    getList(query?: IQuery): Promise<IExplosiveObjectClassDTO[]> {
        return this.offline.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
    }

    get = async (id: string): Promise<IExplosiveObjectClassDTO> => {
        const res = await this.offline.get(id);
        if (!res) throw new Error('there is explosiveObject with id');
        return res;
    };

    subscribe = (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveObjectClassDTO>[]) => void) => {
        return this.offline.subscribe(args, callback);
    };
}
