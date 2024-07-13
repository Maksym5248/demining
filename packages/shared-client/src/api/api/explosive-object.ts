import { type IExplosiveObjectActionDB, type IExplosiveObjectDB } from 'shared-my/db';

import { type ICreateValue, type IUpdateValue, type IDBBase, type IQuery } from '~/common';

import { type IExplosiveObjectDTO, type IExplosiveObjectDTOParams, type IExplosiveObjectActionSumDTO } from '../dto';

export interface IExplosiveObjectAPI {
    create: (value: ICreateValue<IExplosiveObjectDTOParams>) => Promise<IExplosiveObjectDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectDTOParams>) => Promise<IExplosiveObjectDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectDTO>;
    sum: (query?: IQuery) => Promise<IExplosiveObjectActionSumDTO>;
}

export class ExplosiveObjectAPI implements IExplosiveObjectAPI {
    constructor(
        private db: {
            explosiveObject: IDBBase<IExplosiveObjectDB>;
            explosiveObjectAction: IDBBase<IExplosiveObjectActionDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
    ) {}

    create = async (value: ICreateValue<IExplosiveObjectDTOParams>): Promise<IExplosiveObjectDTO> => {
        const res = await this.db.explosiveObject.create({
            details: null,
            ...value,
        });
        if (!res) throw new Error('there is explosive object');

        return res;
    };

    update = async (id: string, value: IUpdateValue<IExplosiveObjectDTOParams>): Promise<IExplosiveObjectDTO> => {
        const explosiveObject = await this.db.explosiveObject.update(id, value);

        if (!explosiveObject) throw new Error('there is explosive object');

        return explosiveObject;
    };

    remove = (id: string) => this.db.explosiveObject.remove(id);

    getList = async (query?: IQuery): Promise<IExplosiveObjectDTO[]> =>
        this.db.explosiveObject.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    get = async (id: string): Promise<IExplosiveObjectDTO> => {
        const res = await this.db.explosiveObject.get(id);
        if (!res) throw new Error('there is explosiveObject with id');
        return res;
    };

    sum = async (query?: IQuery): Promise<IExplosiveObjectActionSumDTO> => {
        const [total, discovered, transported, destroyed] = await Promise.all([
            this.db.explosiveObjectAction.sum('quantity', query),
            this.db.explosiveObjectAction.sum('quantity', {
                where: {
                    isDiscovered: true,
                    ...(query?.where ?? {}),
                },
            }),
            this.db.explosiveObjectAction.sum('quantity', {
                where: {
                    isTransported: true,
                    ...(query?.where ?? {}),
                },
            }),
            this.db.explosiveObjectAction.sum('quantity', {
                where: {
                    isDestroyed: true,
                    ...(query?.where ?? {}),
                },
            }),
        ]);

        return {
            total,
            discovered,
            transported,
            destroyed,
        };
    };
}
