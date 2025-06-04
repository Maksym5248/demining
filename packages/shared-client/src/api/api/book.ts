import { type IBookTypeDB, type IBookDB, type IBookAssetsDB } from 'shared-my';

import { type IUpdateValue, type ICreateValue, type ISubscriptionDocument, type IQuery, type IDBRemote, type IDBLocal } from '~/common';
import { type IFunc, type ILogger, type IStorage } from '~/services';

import { type IBookTypeDTO, type IBookDTO, type IBookAssetsDTO } from '../dto';
import { DBOfflineFirst, type IDBOfflineFirst } from '../offline';

export interface IBookAPI {
    getList: (query?: IQuery) => Promise<IBookDTO[]>;
    create: (value: ICreateValue<IBookDTO>) => Promise<IBookDTO>;
    createBookAssets: (id: string) => Promise<IBookAssetsDTO>;
    update: (id: string, value: IUpdateValue<IBookDTO>) => Promise<IBookDTO>;
    remove: (id: string) => Promise<void>;
    get: (id: string) => Promise<IBookDTO>;
    getAssets: (id: string) => Promise<IBookAssetsDTO>;
    sync: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IBookDTO>[]) => void) => Promise<void>;
    syncBookType: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IBookTypeDTO>[]) => void) => Promise<void>;
}

interface IServices {
    logger: ILogger;
    storage: IStorage;
    func?: IFunc;
}
export class BookAPI implements IBookAPI {
    offline: IDBOfflineFirst<IBookDB>;
    offlineBookAssets: IDBOfflineFirst<IBookAssetsDB>;
    offlineBookType: IDBOfflineFirst<IBookTypeDB>;

    constructor(
        dbRemote: {
            book: IDBRemote<IBookDB>;
            bookAssets: IDBRemote<IBookAssetsDB>;
            bookType: IDBRemote<IBookTypeDB>;
        },
        dbLocal: {
            book: IDBLocal<IBookDB>;
            bookAssets: IDBLocal<IBookAssetsDB>;
            bookType: IDBLocal<IBookTypeDB>;
        },
        private services: IServices,
    ) {
        this.offline = new DBOfflineFirst<IBookDB>(dbRemote.book, dbLocal.book, services);
        this.offlineBookAssets = new DBOfflineFirst<IBookAssetsDB>(dbRemote.bookAssets, dbLocal.bookAssets, services);
        this.offlineBookType = new DBOfflineFirst<IBookTypeDB>(dbRemote.bookType, dbLocal.bookType, services);
    }

    create = async (value: ICreateValue<IBookDTO>): Promise<IBookDTO> => {
        const res = await this.offline.create(value);
        return res;
    };

    update = async (id: string, value: IUpdateValue<IBookDTO>): Promise<IBookDTO> => {
        const res = await this.offline.update(id, value);
        return res;
    };

    remove = async (id: string): Promise<void> => {
        await this.offline.remove(id);
    };

    getList = (query?: IQuery): Promise<IBookDTO[]> =>
        this.offline.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    get = async (id: string): Promise<IBookDTO> => {
        const res = await this.offline.get(id);
        if (!res) throw new Error('there is document with id');
        return res;
    };

    createBookAssets = async (id: string): Promise<IBookAssetsDTO> => {
        if (!this.services.func) {
            throw new Error('Function service is not available');
        }

        await this.services.func.parseBook(id);
        const assets = await this.getAssets(id);
        this.offlineBookAssets.create(assets);
        return assets;
    };

    getAssets = async (id: string): Promise<IBookAssetsDTO> => {
        const res = await this.offlineBookAssets.get(id);
        if (!res) throw new Error('there is document with id');
        return res;
    };

    sync = (args: IQuery | null, callback: (data: ISubscriptionDocument<IBookDTO>[]) => void) => {
        return this.offline.sync(args, callback);
    };

    syncBookType = (args: IQuery | null, callback: (data: ISubscriptionDocument<IBookTypeDTO>[]) => void) => {
        return this.offlineBookType.sync(args, callback);
    };
}
