import { type IExplosiveObjectClassDB } from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBBase, type IQuery, type ISubscriptionDocument } from '~/common';

import { type IExplosiveObjectClassDTO } from '../dto';

export interface IExplosiveObjectClassAPI {
    create: (value: ICreateValue<IExplosiveObjectClassDTO>) => Promise<IExplosiveObjectClassDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectClassDTO>) => Promise<IExplosiveObjectClassDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectClassDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectClassDTO>;
    subscribe: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveObjectClassDTO>[]) => void) => Promise<void>;
}

export class ExplosiveObjectClassAPI implements IExplosiveObjectClassAPI {
    constructor(
        private db: {
            explosiveObjectClass: IDBBase<IExplosiveObjectClassDB>;
        },
    ) {}

    create = async (value: ICreateValue<IExplosiveObjectClassDTO>): Promise<IExplosiveObjectClassDTO> => {
        const res = await this.db.explosiveObjectClass.create(value);
        return res;
    };

    update = async (id: string, value: IUpdateValue<IExplosiveObjectClassDTO>): Promise<IExplosiveObjectClassDTO> => {
        const explosiveObject = await this.db.explosiveObjectClass.update(id, value);

        if (!explosiveObject) throw new Error('there is data by id');

        return explosiveObject;
    };

    remove = (id: string) => this.db.explosiveObjectClass.remove(id);

    getList(query?: IQuery): Promise<IExplosiveObjectClassDTO[]> {
        return this.db.explosiveObjectClass.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
    }

    get = async (id: string): Promise<IExplosiveObjectClassDTO> => {
        const res = await this.db.explosiveObjectClass.get(id);
        if (!res) throw new Error('there is explosiveObject with id');
        return res;
    };

    subscribe = (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveObjectClassDTO>[]) => void) => {
        return this.db.explosiveObjectClass.subscribe(args, callback);
    };
}
