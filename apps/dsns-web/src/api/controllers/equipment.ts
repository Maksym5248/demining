import { type IQuery } from '@/shared';
import { type UpdateValue, type CreateValue } from '@/shared-client';

import { DB } from '~/db';

import { type IEquipmentDTO } from '../types';

const create = (value: CreateValue<IEquipmentDTO>): Promise<IEquipmentDTO> => DB.equipment.create(value);
const update = (id: string, value: UpdateValue<IEquipmentDTO>): Promise<IEquipmentDTO> => DB.equipment.update(id, value);
const remove = (id: string) => DB.equipment.remove(id);
const getList = (query?: IQuery): Promise<IEquipmentDTO[]> =>
    DB.equipment.select({
        order: {
            by: 'createdAt',
            type: 'desc',
        },
        ...(query ?? {}),
    });

const get = async (id: string): Promise<IEquipmentDTO> => {
    const res = await DB.equipment.get(id);
    if (!res) throw new Error('there is equipment with id');
    return res;
};

export const equipment = {
    create,
    update,
    remove,
    getList,
    get,
};
