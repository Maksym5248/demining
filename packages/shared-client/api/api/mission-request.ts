import { type IMissionRequestDB } from '@/shared/db';

import { type IUpdateValue, type ICreateValue, type IQuery, type IDBBase } from '~/common';

import { type IMissionRequestDTO, type IMissionRequestSumDTO } from '../dto';

export interface IMissionRequestAPI {
    create: (value: ICreateValue<IMissionRequestDTO>) => Promise<IMissionRequestDTO>;
    update: (id: string, value: IUpdateValue<IMissionRequestDTO>) => Promise<IMissionRequestDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IMissionRequestDTO[]>;
    get: (id: string) => Promise<IMissionRequestDTO>;
    sum: (query?: IQuery) => Promise<IMissionRequestSumDTO>;
}

export class MissionRequestAPI implements IMissionRequestAPI {
    constructor(
        private db: {
            missionRequest: IDBBase<IMissionRequestDB>;
        },
    ) {}

    create = (value: ICreateValue<IMissionRequestDTO>): Promise<IMissionRequestDTO> => this.db.missionRequest.create(value);
    update = (id: string, value: IUpdateValue<IMissionRequestDTO>): Promise<IMissionRequestDTO> => this.db.missionRequest.update(id, value);
    remove = (id: string) => this.db.missionRequest.remove(id);
    getList = (query?: IQuery): Promise<IMissionRequestDTO[]> =>
        this.db.missionRequest.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    get = async (id: string): Promise<IMissionRequestDTO> => {
        const res = await this.db.missionRequest.get(id);
        if (!res) throw new Error('there is mission request with id');
        return res;
    };

    sum = async (query?: IQuery): Promise<IMissionRequestSumDTO> => {
        const total = await this.db.missionRequest.count(query);

        return {
            total,
        };
    };
}
