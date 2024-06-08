import { IQuery } from '@/shared';

import { explosiveObjectsData } from '~/data';
import { DB } from '~/db';
import { UpdateValue, CreateValue } from '~/types';

import {
    IExplosiveObjectDTO,
    IExplosiveObjectDTOParams,
    IExplosiveObjectActionSumDTO,
} from '../types';

const create = async (
    value: CreateValue<IExplosiveObjectDTOParams>,
): Promise<IExplosiveObjectDTO> => {
    const explosiveObject = await DB.explosiveObject.create(value);
    if (!explosiveObject) throw new Error('there is explosive object');
    return explosiveObject;
};

const update = async (
    id: string,
    value: UpdateValue<IExplosiveObjectDTOParams>,
): Promise<IExplosiveObjectDTO> => {
    const explosiveObject = await DB.explosiveObject.update(id, value);

    if (!explosiveObject) throw new Error('there is explosive object');

    return explosiveObject;
};

const remove = (id: string) => DB.explosiveObject.remove(id);

const getList = async (query?: IQuery): Promise<IExplosiveObjectDTO[]> =>
    DB.explosiveObject.select({
        order: {
            by: 'createdAt',
            type: 'desc',
        },
        ...(query ?? {}),
    });

const init = async (): Promise<void> => {
    const count = await DB.explosiveObject.count();

    if (count) return;

    DB.batchStart();

    explosiveObjectsData.forEach((el) => {
        DB.explosiveObject.create(el);
    });

    await DB.batchCommit();
};

const get = async (id: string): Promise<IExplosiveObjectDTO> => {
    const res = await DB.explosiveObject.get(id);
    if (!res) throw new Error('there is explosiveObject with id');
    return res;
};

const sum = async (query?: IQuery): Promise<IExplosiveObjectActionSumDTO> => {
    const [total, discovered, transported, destroyed] = await Promise.all([
        DB.explosiveObjectAction.sum('quantity', query),
        DB.explosiveObjectAction.sum('quantity', {
            where: {
                isDiscovered: true,
                ...(query?.where ?? {}),
            },
        }),
        DB.explosiveObjectAction.sum('quantity', {
            where: {
                isTransported: true,
                ...(query?.where ?? {}),
            },
        }),
        DB.explosiveObjectAction.sum('quantity', {
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

export const explosiveObject = {
    create,
    update,
    remove,
    getList,
    init,
    get,
    sum,
};
