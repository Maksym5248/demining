import {
    countries,
    explosiveObjectClassData,
    explosiveObjectClassDataItems,
    explosiveObjectGroupsData,
    explosiveObjectTypesData,
    type IExplosiveObjectActionDB,
    type IExplosiveObjectDB,
} from 'shared-my/db';
import { v4 as uuid } from 'uuid';

import { type ICreateValue, type IUpdateValue, type IDBBase, type IQuery } from '~/common';
import { type IAssetStorage } from '~/services';

import {
    type IExplosiveObjectDTO,
    type IExplosiveObjectDTOParams,
    type IExplosiveObjectActionSumDTO,
    type IExplosiveObjectClassDTO,
    type IExplosiveObjectClassItemDTO,
    type ICountryDTO,
    type IExplosiveObjectTypeDTO,
    type IExplosiveObjectGroupDTO,
} from '../dto';

export interface IExplosiveObjectAPI {
    create: (value: ICreateValue<IExplosiveObjectDTOParams>) => Promise<IExplosiveObjectDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectDTOParams>) => Promise<IExplosiveObjectDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectDTO[]>;
    getClassesList: () => Promise<IExplosiveObjectClassDTO[]>;
    getClassesItemsList: () => Promise<IExplosiveObjectClassItemDTO[]>;
    getCountriesList: () => Promise<ICountryDTO[]>;
    getTypesList: () => Promise<IExplosiveObjectTypeDTO[]>;
    getGroupsList: () => Promise<IExplosiveObjectGroupDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectDTO>;
    sum: (query?: IQuery) => Promise<IExplosiveObjectActionSumDTO>;
}

export class ExplosiveObjectAPI implements IExplosiveObjectAPI {
    constructor(
        private db: {
            explosiveObject: IDBBase<IExplosiveObjectDB>;
            explosiveObjectAction: IDBBase<IExplosiveObjectActionDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {}

    create = async ({ image, ...value }: ICreateValue<IExplosiveObjectDTOParams>): Promise<IExplosiveObjectDTO> => {
        let imageUri = null;

        if (image) {
            const id = uuid();
            await this.services.assetStorage.image.save(id, image);
            imageUri = await this.services.assetStorage.image.getFileUrl(id);
        }

        const res = await this.db.explosiveObject.create({
            ...value,
            imageUri,
        });

        if (!res) throw new Error('there is explosive object');

        return res;
    };

    update = async (id: string, { image, ...value }: IUpdateValue<IExplosiveObjectDTOParams>): Promise<IExplosiveObjectDTO> => {
        const current = await this.db.explosiveObject.get(id);

        let imageUri = current?.imageUri;

        if (image) {
            const id = uuid();
            await this.services.assetStorage.image.save(id, image);
            imageUri = await this.services.assetStorage.image.getFileUrl(id);
        }

        const explosiveObject = await this.db.explosiveObject.update(id, {
            ...value,
            imageUri,
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

    async getClassesList() {
        return explosiveObjectClassData;
    }

    async getClassesItemsList() {
        return explosiveObjectClassDataItems;
    }
    async getCountriesList() {
        return countries;
    }
    async getGroupsList() {
        return explosiveObjectGroupsData;
    }

    async getTypesList() {
        return explosiveObjectTypesData;
    }

    get = async (id: string): Promise<IExplosiveObjectDTO> => {
        const res = await this.db.explosiveObject.get(id);
        if (!res) throw new Error('there is explosiveObject with id');
        return res;
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
