import { type IExplosiveObjectTypeDB } from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBBase, type IQuery } from '~/common';
import { type IAssetStorage } from '~/services';

import { type IExplosiveObjectTypeDTO } from '../dto';

export interface IExplosiveObjectTypeAPI {
    create: (value: ICreateValue<IExplosiveObjectTypeDTO>) => Promise<IExplosiveObjectTypeDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectTypeDTO>) => Promise<IExplosiveObjectTypeDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectTypeDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectTypeDTO>;
}

export class ExplosiveObjectTypeAPI implements IExplosiveObjectTypeAPI {
    constructor(
        private db: {
            explosiveObjectType: IDBBase<IExplosiveObjectTypeDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {}

    create = async (value: ICreateValue<IExplosiveObjectTypeDTO>): Promise<IExplosiveObjectTypeDTO> => {
        const res = await this.db.explosiveObjectType.create(value);
        return res;
    };

    update = async (id: string, value: IUpdateValue<IExplosiveObjectTypeDTO>): Promise<IExplosiveObjectTypeDTO> => {
        const explosiveObject = await this.db.explosiveObjectType.update(id, value);

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
