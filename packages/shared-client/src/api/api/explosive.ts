import { type IExplosiveDB } from 'shared-my';

import { type IUpdateValue, type ICreateValue, type IQuery, type IDBRemote, type ISubscriptionDocument } from '~/common';
import { type IAssetStorage } from '~/services';

import { type IExplosiveDTO, type IExplosiveDTOParams } from '../dto';
import { createImage, updateImage } from '../image';

export interface IExplosiveAPI {
    create: (value: ICreateValue<IExplosiveDTOParams>) => Promise<IExplosiveDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveDTOParams>) => Promise<IExplosiveDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveDTO[]>;
    get: (id: string) => Promise<IExplosiveDTO>;
    getByIds: (ids: string[]) => Promise<IExplosiveDTO[]>;
    subscribe: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveDTO>[]) => void) => Promise<void>;
}

export class ExplosiveAPI implements IExplosiveAPI {
    constructor(
        private db: {
            explosive: IDBRemote<IExplosiveDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {}

    create = async ({ image, ...value }: ICreateValue<IExplosiveDTOParams>): Promise<IExplosiveDTO> => {
        const imageUri = await createImage({ image, services: this.services });

        const res = await this.db.explosive.create({
            ...value,
            imageUri,
        });

        if (!res) throw new Error('there is explosive object');

        return res;
    };

    update = async (id: string, { image, ...value }: IUpdateValue<IExplosiveDTOParams>): Promise<IExplosiveDTO> => {
        const current = await this.db.explosive.get(id);
        if (!current) throw new Error('there is explosive object');

        const imageUri = await updateImage({ image, imageUri: current.imageUri, services: this.services });

        const explosiveObject = await this.db.explosive.update(id, {
            ...value,
            imageUri: imageUri ?? null,
        });

        if (!explosiveObject) throw new Error('there is explosive object');

        return explosiveObject;
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

    get = async (id: string): Promise<IExplosiveDTO> => {
        const res = await this.db.explosive.get(id);
        if (!res) throw new Error('there is explosive with id');
        return res;
    };

    getByIds = async (ids: string[]): Promise<IExplosiveDTO[]> => {
        const res = await Promise.all(ids.map(id => this.get(id)));

        return res;
    };

    subscribe = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveDTO>[]) => void) => {
        return this.db.explosive.subscribe(args, callback);
    };
}
