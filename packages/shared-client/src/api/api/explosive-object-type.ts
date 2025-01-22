import { type IExplosiveObjectTypeDB } from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBBase, type IQuery } from '~/common';
import { type IAssetStorage } from '~/services';
import { type IExplosiveObjectTypeDataParams } from '~/stores';

import { type IExplosiveObjectTypeDTOParams, type IExplosiveObjectTypeDTO } from '../dto';
import { createImage, updateImage } from '../image';

export interface IExplosiveObjectTypeAPI {
    create: (value: ICreateValue<IExplosiveObjectTypeDataParams>) => Promise<IExplosiveObjectTypeDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectTypeDTO>) => Promise<IExplosiveObjectTypeDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectTypeDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectTypeDTO>;
}

export class ExplosiveObjectTypeAPI implements IExplosiveObjectTypeAPI {
    constructor(
        private db: {
            explosiveObjectType: IDBBase<IExplosiveObjectTypeDB>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {}

    create = async ({ image, ...value }: ICreateValue<IExplosiveObjectTypeDTOParams>): Promise<IExplosiveObjectTypeDTO> => {
        const imageUri = await createImage({ image, services: this.services });

        const res = await this.db.explosiveObjectType.create({
            ...value,
            imageUri,
        });

        return res;
    };

    update = async (id: string, { image, ...value }: IUpdateValue<IExplosiveObjectTypeDTOParams>): Promise<IExplosiveObjectTypeDTO> => {
        const current = await this.db.explosiveObjectType.get(id);
        if (!current) throw new Error('there is explosive object');

        const imageUri = await updateImage({ image, imageUri: current.imageUri, services: this.services });

        const explosiveObject = await this.db.explosiveObjectType.update(id, {
            ...value,
            imageUri,
        });

        if (!explosiveObject) throw new Error('there is explosive object');

        return explosiveObject;
    };

    remove = (id: string) => this.db.explosiveObjectType.remove(id);

    getList(query?: IQuery): Promise<IExplosiveObjectTypeDTO[]> {
        return this.db.explosiveObjectType.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
    }

    get = async (id: string): Promise<IExplosiveObjectTypeDTO> => {
        const res = await this.db.explosiveObjectType.get(id);
        if (!res) throw new Error('there is explosiveObject with id');
        return res;
    };
}
