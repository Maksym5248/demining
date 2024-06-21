import { EXPLOSIVE_TYPE } from 'shared-my/db';
import { type IExplosiveActionDB, type IExplosiveDB } from 'shared-my/db';

import { type IUpdateValue, type ICreateValue, type IQuery, type IDBBase } from '~/common';

import { type IExplosiveDTO } from '../dto';

export interface IExplosiveAPI {
    create: (value: ICreateValue<IExplosiveDTO>) => Promise<IExplosiveDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveDTO>) => Promise<IExplosiveDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveDTO[]>;
    getListExplosive: (query?: IQuery) => Promise<IExplosiveDTO[]>;
    getListDetonators: (query?: IQuery) => Promise<IExplosiveDTO[]>;
    get: (id: string) => Promise<IExplosiveDTO>;
    sum: (query?: IQuery) => Promise<{ explosive: number; detonator: number }>;
}

export class ExplosiveAPI implements IExplosiveAPI {
    constructor(
        private db: {
            explosive: IDBBase<IExplosiveDB>;
            explosiveAction: IDBBase<IExplosiveActionDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
    ) {}

    create = async (value: ICreateValue<IExplosiveDTO>): Promise<IExplosiveDTO> => {
        const explosive = await this.db.explosive.create(value);
        if (!explosive) throw new Error('there is explosive by id');
        return explosive;
    };

    update = async (id: string, value: IUpdateValue<IExplosiveDTO>): Promise<IExplosiveDTO> => {
        const explosive = await this.db.explosive.update(id, value);

        if (!explosive) throw new Error('there is explosive object');

        return explosive;
    };

    remove = (id: string) => this.db.explosive.remove(id);

    getList = async (query?: IQuery): Promise<IExplosiveDTO[]> =>
        this.db.explosive.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    getListExplosive = async (query?: IQuery): Promise<IExplosiveDTO[]> =>
        this.db.explosive.select({
            ...(query ?? {}),
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            where: {
                ...(query?.where ?? {}),
                type: EXPLOSIVE_TYPE.EXPLOSIVE,
            },
        });

    getListDetonators = async (query?: IQuery): Promise<IExplosiveDTO[]> =>
        this.db.explosive.select({
            ...(query ?? {}),
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            where: {
                ...(query?.where ?? {}),
                type: EXPLOSIVE_TYPE.DETONATOR,
            },
        });

    get = async (id: string): Promise<IExplosiveDTO> => {
        const res = await this.db.explosive.get(id);
        if (!res) throw new Error('there is explosive with id');
        return res;
    };

    sum = async (
        query?: IQuery,
    ): Promise<{
        explosive: number;
        detonator: number;
    }> => {
        const [explosive, detonator] = await Promise.all([
            this.db.explosiveAction.sum('weight', {
                where: {
                    type: EXPLOSIVE_TYPE.EXPLOSIVE,
                    ...(query?.where ?? {}),
                },
            }),
            this.db.explosiveAction.sum('quantity', {
                where: {
                    type: EXPLOSIVE_TYPE.DETONATOR,
                    ...(query?.where ?? {}),
                },
            }),
        ]);

        return {
            explosive,
            detonator,
        };
    };
}
