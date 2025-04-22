import {
    type IExplosiveObjectTypeDB,
    type IExplosiveObjectActionDB,
    type IExplosiveObjectDB,
    type IExplosiveObjectDetailsDB,
    type IExplosiveObjectClassDB,
    type IExplosiveObjectClassItemDB,
    type IExplosiveDB,
    type IExplosiveObjectComponentDB,
} from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBBase, type IQuery, type ISubscriptionDocument } from '~/common';
import { type IAssetStorage } from '~/services';

import {
    type IExplosiveObjectDTO,
    type IExplosiveObjectDTOParams,
    type IExplosiveObjectActionSumDTO,
    type IExplosiveObjectClassItemDTO,
    type IExplosiveObjectFullDTO,
    type IExplosiveObjectDetailsDTO,
    type IExplosiveObjectComponentDTO,
} from '../dto';
import { createImage, updateImage } from '../image';

export interface IExplosiveObjectAPI {
    create: (value: ICreateValue<IExplosiveObjectDTOParams>) => Promise<IExplosiveObjectFullDTO>;
    update: (id: string, value: IUpdateValue<IExplosiveObjectDTOParams>) => Promise<IExplosiveObjectFullDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IExplosiveObjectDTO[]>;
    getClassesItemsList: () => Promise<IExplosiveObjectClassItemDTO[]>;
    get: (id: string) => Promise<IExplosiveObjectFullDTO>;
    sum: (query?: IQuery) => Promise<IExplosiveObjectActionSumDTO>;
    subscribe: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IExplosiveObjectDTO>[]) => void) => Promise<void>;
    subscribeDetails: (
        args: Partial<IQuery> | null,
        callback: (data: ISubscriptionDocument<IExplosiveObjectDetailsDTO>[]) => void,
    ) => Promise<void>;
    subscribeComponents: (
        args: Partial<IQuery> | null,
        callback: (data: ISubscriptionDocument<IExplosiveObjectComponentDTO>[]) => void,
    ) => Promise<void>;
}

export class ExplosiveObjectAPI implements IExplosiveObjectAPI {
    constructor(
        private db: {
            explosiveObjectType: IDBBase<IExplosiveObjectTypeDB>;
            explosiveObjectClass: IDBBase<IExplosiveObjectClassDB>;
            explosiveObjectClassItem: IDBBase<IExplosiveObjectClassItemDB>;
            explosiveObject: IDBBase<IExplosiveObjectDB>;
            explosiveObjectDetails: IDBBase<IExplosiveObjectDetailsDB>;
            explosiveObjectAction: IDBBase<IExplosiveObjectActionDB>;
            explosiveObjectComponent: IDBBase<IExplosiveObjectComponentDB>;
            explosive: IDBBase<IExplosiveDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {}

    create = async ({ image, details, status, ...value }: ICreateValue<IExplosiveObjectDTOParams>): Promise<IExplosiveObjectFullDTO> => {
        const imageUri = await createImage({ image, services: this.services });
        const id = this.db.explosiveObject.uuid();

        this.db.batchStart();

        this.db.explosiveObject.batchCreate({
            ...value,
            imageUri,
            status,
            id,
        });

        if (details) {
            this.db.explosiveObjectDetails.batchCreate({
                ...(details ?? {}),
                status,
                id,
            });
        }

        await this.db.batchCommit();

        return this.get(id);
    };

    update = async (
        id: string,
        { image, status, details, ...value }: IUpdateValue<IExplosiveObjectDTOParams>,
    ): Promise<IExplosiveObjectFullDTO> => {
        const current = await this.db.explosiveObject.get(id);
        if (!current) throw new Error('there is explosive object');

        const imageUri = await updateImage({ image, imageUri: current.imageUri, services: this.services });

        this.db.batchStart();

        this.db.explosiveObject.batchUpdate(id, {
            ...value,
            status,
            imageUri: imageUri ?? null,
        });

        if (details) {
            this.db.explosiveObjectDetails.batchUpdate(id, {
                ...(details ?? {}),
                status,
            });
        }

        await this.db.batchCommit();

        return this.get(id);
    };

    remove = async (id: string) => {
        this.db.batchStart();

        this.db.explosiveObject.batchRemove(id);
        this.db.explosiveObjectDetails.batchRemove(id);

        await this.db.batchCommit();

        return id;
    };

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

    get = async (id: string): Promise<IExplosiveObjectFullDTO> => {
        const [res, details] = await Promise.all([this.db.explosiveObject.get(id), this.db.explosiveObjectDetails.get(id)]);

        const explosiveIds = (details?.filler?.map(el => el.explosiveId).filter(Boolean) as string[]) ?? [];

        const [explosive, fuse, fervor] = await Promise.all([
            this.db.explosive.getByIds(explosiveIds),
            this.db.explosiveObject.getByIds(details?.fuseIds ?? []),
            this.db.explosiveObject.getByIds(details?.fervorIds ?? []),
        ]);

        if (!res) throw new Error('there is explosiveObject with id');

        return {
            ...res,
            explosive,
            fuse,
            fervor,
            details,
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

    subscribe = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveObjectDTO>[]) => void) => {
        return this.db.explosiveObject.subscribe(args, callback);
    };

    subscribeDetails = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveObjectDetailsDTO>[]) => void) => {
        return this.db.explosiveObjectDetails.subscribe(args, callback);
    };

    subscribeComponents = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveObjectComponentDTO>[]) => void) => {
        return this.db.explosiveObjectComponent.subscribe(args, callback);
    };
}
