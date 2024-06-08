import { IQuery } from '@/shared';

import { DB } from '~/db';
import { UpdateValue, CreateValue } from '~/types';

import { IMissionRequestDTO, IMissionRequestSumDTO } from '../types';

const create = (value: CreateValue<IMissionRequestDTO>): Promise<IMissionRequestDTO> =>
    DB.missionRequest.create(value);
const update = (id: string, value: UpdateValue<IMissionRequestDTO>): Promise<IMissionRequestDTO> =>
    DB.missionRequest.update(id, value);
const remove = (id: string) => DB.missionRequest.remove(id);
const getList = (query?: IQuery): Promise<IMissionRequestDTO[]> =>
    DB.missionRequest.select({
        order: {
            by: 'createdAt',
            type: 'desc',
        },
        ...(query ?? {}),
    });

const get = async (id: string): Promise<IMissionRequestDTO> => {
    const res = await DB.missionRequest.get(id);
    if (!res) throw new Error('there is mission request with id');
    return res;
};

const sum = async (query?: IQuery): Promise<IMissionRequestSumDTO> => {
    const total = await DB.missionReport.count(query);

    return {
        total,
    };
};

export const missionRequest = {
    create,
    update,
    remove,
    getList,
    get,
    sum,
};
