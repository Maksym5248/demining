import { EXPLOSIVE_DEVICE_TYPE, type IExplosiveDeviceTypeDB, type IExplosiveDeviceActionDB, type IExplosiveDeviceDB } from 'shared-my';

import { type IUpdateValue, type ICreateValue, type IQuery, type IDBRemote, type ISubscriptionDocument, type IDBLocal } from '~/common';
import { type ILogger, type IStorage } from '~/services';

import { type IExplosiveDeviceTypeDTO, type IExplosiveDeviceDTO } from '../dto';
import { DBOfflineFirst } from '../offline';

export interface IExplosiveDeviceAPI {
    create: (value: ICreateValue<IExplosiveDeviceDTO>) => Promise<IExplosiveDeviceDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveDeviceDTO>) => Promise<IExplosiveDeviceDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveDeviceDTO[]>;
    getListExplosive: (query?: IQuery) => Promise<IExplosiveDeviceDTO[]>;
    getListDetonators: (query?: IQuery) => Promise<IExplosiveDeviceDTO[]>;
    get: (id: string) => Promise<IExplosiveDeviceDTO>;
    sum: (query?: IQuery) => Promise<{ explosive: number; detonator: number }>;
    sync: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveDeviceDTO>[]) => void) => Promise<void>;
    syncType: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveDeviceTypeDTO>[]) => void) => Promise<void>;
}

interface IServices {
    logger: ILogger;
    storage: IStorage;
}

export class ExplosiveDeviceAPI implements IExplosiveDeviceAPI {
    offline: {
        explosiveDevice: DBOfflineFirst<IExplosiveDeviceDB>;
        explosiveDeviceType: DBOfflineFirst<IExplosiveDeviceTypeDB>;
    };

    constructor(
        private dbRemote: {
            explosiveDevice: IDBRemote<IExplosiveDeviceDB>;
            explosiveDeviceType: IDBRemote<IExplosiveDeviceTypeDB>;
            explosiveDeviceAction: IDBRemote<IExplosiveDeviceActionDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
        dbLocal: {
            explosiveDevice: IDBLocal<IExplosiveDeviceDB>;
            explosiveDeviceType: IDBLocal<IExplosiveDeviceTypeDB>;
        },
        serices: IServices,
    ) {
        this.offline = {
            explosiveDevice: new DBOfflineFirst<IExplosiveDeviceDB>(dbRemote.explosiveDevice, dbLocal.explosiveDevice, serices),
            explosiveDeviceType: new DBOfflineFirst<IExplosiveDeviceTypeDB>(
                dbRemote.explosiveDeviceType,
                dbLocal.explosiveDeviceType,
                serices,
            ),
        };
    }

    create = async (value: ICreateValue<IExplosiveDeviceDTO>): Promise<IExplosiveDeviceDTO> => {
        const explosive = await this.offline.explosiveDevice.create(value);
        if (!explosive) throw new Error('there is explosive by id');
        return explosive;
    };

    update = async (id: string, value: IUpdateValue<IExplosiveDeviceDTO>): Promise<IExplosiveDeviceDTO> => {
        const explosive = await this.offline.explosiveDevice.update(id, value);

        if (!explosive) throw new Error('there is explosive object');

        return explosive;
    };

    remove = (id: string) => this.offline.explosiveDevice.remove(id);

    getList = async (query?: IQuery): Promise<IExplosiveDeviceDTO[]> =>
        this.offline.explosiveDevice.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    getListExplosive = async (query?: IQuery): Promise<IExplosiveDeviceDTO[]> =>
        this.offline.explosiveDevice.select({
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
        this.offline.explosiveDevice.select({
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
        const res = await this.offline.explosiveDevice.get(id);
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
            this.dbRemote.explosiveDeviceAction.sum('weight', {
                where: {
                    type: EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE,
                    ...(query?.where ?? {}),
                },
            }),
            this.dbRemote.explosiveDeviceAction.sum('quantity', {
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

    sync = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveDeviceDTO>[]) => void) => {
        return this.offline.explosiveDevice.sync(args, callback);
    };

    syncType = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveDeviceTypeDTO>[]) => void) => {
        return this.offline.explosiveDeviceType.sync(args, callback);
    };
}
