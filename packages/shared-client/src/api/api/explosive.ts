import { type IExplosiveDB } from 'shared-my';

import { type IUpdateValue, type ICreateValue, type IQuery, type IDBRemote, type ISubscriptionDocument, type IDBLocal } from '~/common';
import { type IAssetStorage } from '~/services';

import { type IExplosiveDTO, type IExplosiveDTOParams } from '../dto';
import { createImage, updateImage } from '../image';
import { DBOfflineFirst } from '../offline';

export interface IExplosiveAPI {
    create: (value: ICreateValue<IExplosiveDTOParams>) => Promise<IExplosiveDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveDTOParams>) => Promise<IExplosiveDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveDTO[]>;
    get: (id: string) => Promise<IExplosiveDTO>;
    getByIds: (ids: string[]) => Promise<IExplosiveDTO[]>;
    sync: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveDTO>[]) => void) => Promise<void>;
}

export class ExplosiveAPI implements IExplosiveAPI {
    offline: {
        explosive: DBOfflineFirst<IExplosiveDB>;
    };

    constructor(
        dbRemote: {
            explosive: IDBRemote<IExplosiveDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
        dbLocal: {
            explosive: IDBLocal<IExplosiveDB>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {
        this.offline = {
            explosive: new DBOfflineFirst<IExplosiveDB>(dbRemote.explosive, dbLocal.explosive),
        };
    }

    create = async ({ image, ...value }: ICreateValue<IExplosiveDTOParams>): Promise<IExplosiveDTO> => {
        const imageUri = await createImage({ image, services: this.services });

        const res = await this.offline.explosive.create({
            ...value,
            imageUri,
        });

        if (!res) throw new Error('there is explosive object');

        return res;
    };

    update = async (id: string, { image, ...value }: IUpdateValue<IExplosiveDTOParams>): Promise<IExplosiveDTO> => {
        const current = await this.offline.explosive.get(id);
        if (!current) throw new Error('there is explosive object');

        const imageUri = await updateImage({ image, imageUri: current.imageUri, services: this.services });

        const explosiveObject = await this.offline.explosive.update(id, {
            ...value,
            imageUri: imageUri ?? null,
        });

        if (!explosiveObject) throw new Error('there is explosive object');

        return explosiveObject;
    };

    remove = (id: string) => this.offline.explosive.remove(id);

    getList = async (query?: IQuery): Promise<IExplosiveDTO[]> =>
        this.offline.explosive.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    get = async (id: string): Promise<IExplosiveDTO> => {
        const res = await this.offline.explosive.get(id);
        if (!res) throw new Error('there is explosive with id');
        return res;
    };

    getByIds = async (ids: string[]): Promise<IExplosiveDTO[]> => {
        const res = await Promise.all(ids.map(id => this.get(id)));

        return res;
    };

    sync = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveDTO>[]) => void) => {
        return this.offline.explosive.sync(args, callback);
    };
}
