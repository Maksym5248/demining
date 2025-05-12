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

import { type ICreateValue, type IUpdateValue, type IDBRemote, type IQuery, type ISubscriptionDocument, type IDBLocal } from '~/common';
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
import { DBOfflineFirst, type IDBOfflineFirst } from '../offline';

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
    offline: {
        explosiveObjectType: IDBOfflineFirst<IExplosiveObjectTypeDB>;
        explosiveObjectClass: IDBOfflineFirst<IExplosiveObjectClassDB>;
        explosiveObjectClassItem: IDBOfflineFirst<IExplosiveObjectClassItemDB>;
        explosiveObject: IDBOfflineFirst<IExplosiveObjectDB>;
        explosiveObjectDetails: IDBOfflineFirst<IExplosiveObjectDetailsDB>;
        explosiveObjectComponent: IDBOfflineFirst<IExplosiveObjectComponentDB>;
        explosive: IDBOfflineFirst<IExplosiveDB>;
    };
    constructor(
        private dbRemote: {
            explosiveObjectType: IDBRemote<IExplosiveObjectTypeDB>;
            explosiveObjectClass: IDBRemote<IExplosiveObjectClassDB>;
            explosiveObjectClassItem: IDBRemote<IExplosiveObjectClassItemDB>;
            explosiveObject: IDBRemote<IExplosiveObjectDB>;
            explosiveObjectDetails: IDBRemote<IExplosiveObjectDetailsDB>;
            explosiveObjectAction: IDBRemote<IExplosiveObjectActionDB>;
            explosiveObjectComponent: IDBRemote<IExplosiveObjectComponentDB>;
            explosive: IDBRemote<IExplosiveDB>;
            batchStart(): void;
            batchCommit(): Promise<void>;
        },
        private dbLocal: {
            explosiveObjectType: IDBLocal<IExplosiveObjectTypeDB>;
            explosiveObjectClass: IDBLocal<IExplosiveObjectClassDB>;
            explosiveObjectClassItem: IDBLocal<IExplosiveObjectClassItemDB>;
            explosiveObject: IDBLocal<IExplosiveObjectDB>;
            explosiveObjectDetails: IDBLocal<IExplosiveObjectDetailsDB>;
            explosiveObjectComponent: IDBLocal<IExplosiveObjectComponentDB>;
            explosive: IDBLocal<IExplosiveDB>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {
        this.offline = {
            explosiveObjectType: new DBOfflineFirst<IExplosiveObjectTypeDB>(dbRemote.explosiveObjectType, dbLocal.explosiveObjectType),
            explosiveObjectClass: new DBOfflineFirst<IExplosiveObjectClassDB>(dbRemote.explosiveObjectClass, dbLocal.explosiveObjectClass),
            explosiveObjectClassItem: new DBOfflineFirst<IExplosiveObjectClassItemDB>(
                dbRemote.explosiveObjectClassItem,
                dbLocal.explosiveObjectClassItem,
            ),
            explosiveObject: new DBOfflineFirst<IExplosiveObjectDB>(dbRemote.explosiveObject, dbLocal.explosiveObject),
            explosiveObjectDetails: new DBOfflineFirst<IExplosiveObjectDetailsDB>(
                dbRemote.explosiveObjectDetails,
                dbLocal.explosiveObjectDetails,
            ),
            explosiveObjectComponent: new DBOfflineFirst<IExplosiveObjectComponentDB>(
                dbRemote.explosiveObjectComponent,
                dbLocal.explosiveObjectComponent,
            ),
            explosive: new DBOfflineFirst<IExplosiveDB>(dbRemote.explosive, dbLocal.explosive),
        };
    }

    create = async ({ image, details, status, ...value }: ICreateValue<IExplosiveObjectDTOParams>): Promise<IExplosiveObjectFullDTO> => {
        const imageUri = await createImage({ image, services: this.services });
        const id = this.dbRemote.explosiveObject.uuid();

        this.dbRemote.batchStart();

        this.dbRemote.explosiveObject.batchCreate({
            ...value,
            imageUri,
            status,
            id,
        });

        if (details) {
            this.dbRemote.explosiveObjectDetails.batchCreate({
                ...(details ?? {}),
                status,
                id,
            });
        }

        await this.dbRemote.batchCommit();

        return this.get(id);
    };

    update = async (
        id: string,
        { image, status, details, ...value }: IUpdateValue<IExplosiveObjectDTOParams>,
    ): Promise<IExplosiveObjectFullDTO> => {
        const current = await this.dbRemote.explosiveObject.get(id);
        if (!current) throw new Error('there is explosive object');

        const imageUri = await updateImage({ image, imageUri: current.imageUri, services: this.services });

        this.dbRemote.batchStart();

        this.dbRemote.explosiveObject.batchUpdate(id, {
            ...value,
            status,
            imageUri: imageUri ?? null,
        });

        if (details) {
            this.dbRemote.explosiveObjectDetails.batchUpdate(id, {
                ...(details ?? {}),
                status,
            });
        }

        await this.dbRemote.batchCommit();

        return this.get(id);
    };

    remove = async (id: string) => {
        this.dbRemote.batchStart();

        this.dbRemote.explosiveObject.batchRemove(id);
        this.dbRemote.explosiveObjectDetails.batchRemove(id);

        await this.dbRemote.batchCommit();

        return id;
    };

    getList = async (query?: IQuery): Promise<IExplosiveObjectDTO[]> =>
        this.dbRemote.explosiveObject.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    getClassesItemsList(query?: IQuery) {
        return this.dbRemote.explosiveObjectClassItem.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
    }

    get = async (id: string): Promise<IExplosiveObjectFullDTO> => {
        const [res, details] = await Promise.all([this.dbRemote.explosiveObject.get(id), this.dbRemote.explosiveObjectDetails.get(id)]);

        const explosiveIds = (details?.filler?.map(el => el.explosiveId).filter(Boolean) as string[]) ?? [];

        const [explosive, fuse, fervor] = await Promise.all([
            this.dbRemote.explosive.getByIds(explosiveIds),
            this.dbRemote.explosiveObject.getByIds(details?.fuseIds ?? []),
            this.dbRemote.explosiveObject.getByIds(details?.fervorIds ?? []),
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
            this.dbRemote.explosiveObjectAction.sum('quantity', query),
            this.dbRemote.explosiveObjectAction.sum('quantity', {
                where: {
                    isDiscovered: true,
                    ...(query?.where ?? {}),
                },
            }),
            this.dbRemote.explosiveObjectAction.sum('quantity', {
                where: {
                    isTransported: true,
                    ...(query?.where ?? {}),
                },
            }),
            this.dbRemote.explosiveObjectAction.sum('quantity', {
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
        return this.offline.explosiveObject.subscribe(args, callback);
    };

    subscribeDetails = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveObjectDetailsDTO>[]) => void) => {
        return this.offline.explosiveObjectDetails.subscribe(args, callback);
    };

    subscribeComponents = (args: IQuery | null, callback: (data: ISubscriptionDocument<IExplosiveObjectComponentDTO>[]) => void) => {
        return this.offline.explosiveObjectComponent.subscribe(args, callback);
    };
}
