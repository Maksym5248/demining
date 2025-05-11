import { type IExplosiveObjectClassItemDB } from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBRemote, type IQuery, type ISubscriptionDocument } from '~/common';

import { type IExplosiveObjectClassItemDTO } from '../dto';

export interface IExplosiveObjectClassItemAPI {
    create: (value: ICreateValue<IExplosiveObjectClassItemDTO>) => Promise<IExplosiveObjectClassItemDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectClassItemDTO>) => Promise<IExplosiveObjectClassItemDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectClassItemDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectClassItemDTO>;
    subscribe: (
        args: Partial<IQuery> | null,
        callback: (data: ISubscriptionDocument<IExplosiveObjectClassItemDTO>[]) => void,
    ) => Promise<void>;
}

export class ExplosiveObjectClassItemAPI implements IExplosiveObjectClassItemAPI {
    constructor(
        private db: {
            explosiveObjectClassItem: IDBRemote<IExplosiveObjectClassItemDB>;
        },
    ) {}

    create = async (value: ICreateValue<IExplosiveObjectClassItemDTO>): Promise<IExplosiveObjectClassItemDTO> => {
        const res = await this.db.explosiveObjectClassItem.create(value);
        return res;
    };

    update = async (id: string, value: IUpdateValue<IExplosiveObjectClassItemDTO>): Promise<IExplosiveObjectClassItemDTO> => {
        const explosiveObject = await this.db.explosiveObjectClassItem.update(id, value);

        if (!explosiveObject) throw new Error('there is data by id');

        return explosiveObject;
    };

    remove = (id: string) => this.db.explosiveObjectClassItem.remove(id);

    getList(query?: IQuery): Promise<IExplosiveObjectClassItemDTO[]> {
        return this.db.explosiveObjectClassItem.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
    }

    get = async (id: string): Promise<IExplosiveObjectClassItemDTO> => {
        const res = await this.db.explosiveObjectClassItem.get(id);
        if (!res) throw new Error('there is explosiveObject with id');
        return res;
    };

    subscribe = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveObjectClassItemDTO>[]) => void) => {
        return this.db.explosiveObjectClassItem.subscribe(args, callback);
    };
}
