import {
    countries,
    type IExplosiveObjectTypeDB,
    type IExplosiveObjectActionDB,
    type IExplosiveObjectDB,
    type IExplosiveObjectClassDB,
    type IExplosiveObjectClassItemDB,
    type IExplosiveDB,
} from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBBase, type IQuery } from '~/common';
import { type IAssetStorage } from '~/services';

import {
    type IExplosiveObjectDTO,
    type IExplosiveObjectDTOParams,
    type IExplosiveObjectActionSumDTO,
    type IExplosiveObjectClassItemDTO,
    type ICountryDTO,
    type IExplosiveObjectFullDTO,
} from '../dto';
import { createImage, updateImage } from '../image';

export interface IExplosiveObjectAPI {
    create: (value: ICreateValue<IExplosiveObjectDTOParams>) => Promise<IExplosiveObjectDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectDTOParams>) => Promise<IExplosiveObjectDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectDTO[]>;
    getClassesItemsList: () => Promise<IExplosiveObjectClassItemDTO[]>;
    getCountriesList: () => Promise<ICountryDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectFullDTO>;
    sum: (query?: IQuery) => Promise<IExplosiveObjectActionSumDTO>;
}

export class ExplosiveObjectAPI implements IExplosiveObjectAPI {
    constructor(
        private db: {
            explosiveObjectType: IDBBase<IExplosiveObjectTypeDB>;
            explosiveObjectClass: IDBBase<IExplosiveObjectClassDB>;
            explosiveObjectClassItem: IDBBase<IExplosiveObjectClassItemDB>;
            explosiveObject: IDBBase<IExplosiveObjectDB>;
            explosiveObjectAction: IDBBase<IExplosiveObjectActionDB>;
            explosive: IDBBase<IExplosiveDB>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {}

    create = async ({ image, ...value }: ICreateValue<IExplosiveObjectDTOParams>): Promise<IExplosiveObjectDTO> => {
        const imageUri = await createImage({ image, services: this.services });

        const res = await this.db.explosiveObject.create({
            ...value,
            imageUri,
        });

        if (!res) throw new Error('there is explosive object');

        return res;
    };

    update = async (id: string, { image, ...value }: IUpdateValue<IExplosiveObjectDTOParams>): Promise<IExplosiveObjectDTO> => {
        const current = await this.db.explosiveObject.get(id);
        if (!current) throw new Error('there is explosive object');

        const imageUri = await updateImage({ image, imageUri: current.imageUri, services: this.services });

        const explosiveObject = await this.db.explosiveObject.update(id, {
            ...value,
            imageUri: imageUri ?? null,
        });

        if (!explosiveObject) throw new Error('there is explosive object');

        return explosiveObject;
    };

    remove = (id: string) => this.db.explosiveObject.remove(id);

    getList = async (query?: IQuery): Promise<IExplosiveObjectDTO[]> =>
        this.db.explosiveObject.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    getClassesItemsList(query?: IQuery) {
        return this.db.explosiveObjectClassItem.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
    }
    async getCountriesList() {
        return countries;
    }

    get = async (id: string): Promise<IExplosiveObjectFullDTO> => {
        const res = await this.db.explosiveObject.get(id);
        const explosiveIds = (res?.details?.filler?.map(el => el.explosiveId).filter(Boolean) as string[]) ?? [];
        const explosive = await this.db.explosive.getByIds(explosiveIds);
        if (!res) throw new Error('there is explosiveObject with id');

        return {
            ...res,
            explosive,
        };
    };

    sum = async (query?: IQuery): Promise<IExplosiveObjectActionSumDTO> => {
        const [total, discovered, transported, destroyed] = await Promise.all([
            this.db.explosiveObjectAction.sum('quantity', query),
            this.db.explosiveObjectAction.sum('quantity', {
                where: {
                    isDiscovered: true,
                    ...(query?.where ?? {}),
                },
            }),
            this.db.explosiveObjectAction.sum('quantity', {
                where: {
                    isTransported: true,
                    ...(query?.where ?? {}),
                },
            }),
            this.db.explosiveObjectAction.sum('quantity', {
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
}
