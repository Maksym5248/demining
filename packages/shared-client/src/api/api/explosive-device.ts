import { EXPLOSIVE_DEVICE_TYPE } from 'shared-my';
import { type IExplosiveDeviceActionDB, type IExplosiveDeviceDB } from 'shared-my';

import { type IUpdateValue, type ICreateValue, type IQuery, type IDBBase, type ISubscriptionDocument } from '~/common';

import { type IExplosiveDeviceDTO } from '../dto';

export interface IExplosiveDeviceAPI {
    create: (value: ICreateValue<IExplosiveDeviceDTO>) => Promise<IExplosiveDeviceDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveDeviceDTO>) => Promise<IExplosiveDeviceDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveDeviceDTO[]>;
    getListExplosive: (query?: IQuery) => Promise<IExplosiveDeviceDTO[]>;
    getListDetonators: (query?: IQuery) => Promise<IExplosiveDeviceDTO[]>;
    get: (id: string) => Promise<IExplosiveDeviceDTO>;
    sum: (query?: IQuery) => Promise<{ explosive: number; detonator: number }>;
    subscribe: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveDeviceDTO>[]) => void) => Promise<void>;
}

export class ExplosiveDeviceAPI implements IExplosiveDeviceAPI {
    constructor(
        private db: {
            explosiveDevice: IDBBase<IExplosiveDeviceDB>;
            explosiveDeviceAction: IDBBase<IExplosiveDeviceActionDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
    ) {}

    create = async (value: ICreateValue<IExplosiveDeviceDTO>): Promise<IExplosiveDeviceDTO> => {
        const explosive = await this.db.explosiveDevice.create(value);
        if (!explosive) throw new Error('there is explosive by id');
        return explosive;
    };

    update = async (id: string, value: IUpdateValue<IExplosiveDeviceDTO>): Promise<IExplosiveDeviceDTO> => {
        const explosive = await this.db.explosiveDevice.update(id, value);

        if (!explosive) throw new Error('there is explosive object');

        return explosive;
    };

    remove = (id: string) => this.db.explosiveDevice.remove(id);

    getList = async (query?: IQuery): Promise<IExplosiveDeviceDTO[]> =>
        this.db.explosiveDevice.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    getListExplosive = async (query?: IQuery): Promise<IExplosiveDeviceDTO[]> =>
        this.db.explosiveDevice.select({
            ...(query ?? {}),
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            where: {
                ...(query?.where ?? {}),
                type: EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE,
            },
        });

    getListDetonators = async (query?: IQuery): Promise<IExplosiveDeviceDTO[]> =>
        this.db.explosiveDevice.select({
            ...(query ?? {}),
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            where: {
                ...(query?.where ?? {}),
                type: EXPLOSIVE_DEVICE_TYPE.DETONATOR,
            },
        });

    get = async (id: string): Promise<IExplosiveDeviceDTO> => {
        const res = await this.db.explosiveDevice.get(id);
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
            this.db.explosiveDeviceAction.sum('weight', {
                where: {
                    type: EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE,
                    ...(query?.where ?? {}),
                },
            }),
            this.db.explosiveDeviceAction.sum('quantity', {
                where: {
                    type: EXPLOSIVE_DEVICE_TYPE.DETONATOR,
                    ...(query?.where ?? {}),
                },
            }),
        ]);

        return {
            explosive,
            detonator,
        };
    };

    subscribe = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveDeviceDTO>[]) => void) => {
        return this.db.explosiveDevice.subscribe(args, callback);
    };
}
