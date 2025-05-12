import { type IExplosiveObjectTypeDB } from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBRemote, type IQuery, type ISubscriptionDocument, type IDBLocal } from '~/common';
import { type IAssetStorage } from '~/services';
import { type IExplosiveObjectTypeDataParams } from '~/stores';

import { type IExplosiveObjectTypeDTOParams, type IExplosiveObjectTypeDTO } from '../dto';
import { createImage, updateImage } from '../image';
import { DBOfflineFirst, type IDBOfflineFirst } from '../offline';

export interface IExplosiveObjectTypeAPI {
    create: (value: ICreateValue<IExplosiveObjectTypeDataParams>) => Promise<IExplosiveObjectTypeDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectTypeDTO>) => Promise<IExplosiveObjectTypeDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectTypeDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectTypeDTO>;
    subscribe: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveObjectTypeDTO>[]) => void) => Promise<void>;
}

export class ExplosiveObjectTypeAPI implements IExplosiveObjectTypeAPI {
    offline: IDBOfflineFirst<IExplosiveObjectTypeDB>;
    constructor(
        dbRemote: {
            explosiveObjectType: IDBRemote<IExplosiveObjectTypeDB>;
        },
        dbLocal: {
            explosiveObjectType: IDBLocal<IExplosiveObjectTypeDB>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {
        this.offline = new DBOfflineFirst<IExplosiveObjectTypeDB>(dbRemote.explosiveObjectType, dbLocal.explosiveObjectType);
    }

    create = async ({ image, ...value }: ICreateValue<IExplosiveObjectTypeDTOParams>): Promise<IExplosiveObjectTypeDTO> => {
        const imageUri = await createImage({ image, services: this.services });

        const res = await this.offline.create({
            ...value,
            imageUri,
        });

        return res;
    };

    update = async (id: string, { image, ...value }: IUpdateValue<IExplosiveObjectTypeDTOParams>): Promise<IExplosiveObjectTypeDTO> => {
        const current = await this.offline.get(id);
        if (!current) throw new Error('there is explosive object');

        const imageUri = await updateImage({ image, imageUri: current.imageUri, services: this.services });

        const explosiveObject = await this.offline.update(id, {
            ...value,
            imageUri,
        });

        if (!explosiveObject) throw new Error('there is explosive object');

        return explosiveObject;
    };

    remove = async (id: string) => {
        await this.offline.remove(id);

        return id;
    };

    getList(query?: IQuery): Promise<IExplosiveObjectTypeDTO[]> {
        return this.offline.select(query);
    }

    get = async (id: string): Promise<IExplosiveObjectTypeDTO> => {
        const res = await this.offline.get(id);
        if (!res || !!res?.isDeleted) throw new Error('there is explosiveObject with id');
        return res;
    };

    subscribe = async (query: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveObjectTypeDTO>[]) => void) => {
        await this.offline.subscribe(query, callback);
    };
}
