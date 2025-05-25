import { type IBookTypeDB, type IBookDB } from 'shared-my';

import { type IUpdateValue, type ICreateValue, type ISubscriptionDocument, type IQuery, type IDBRemote, type IDBLocal } from '~/common';
import { type ILogger, type IStorage } from '~/services';

import { type IBookTypeDTO, type IBookDTO } from '../dto';
import { DBOfflineFirst, type IDBOfflineFirst } from '../offline';

export interface IBookAPI {
    getList: (query?: IQuery) => Promise<IBookDTO[]>;
    create: (value: ICreateValue<IBookDTO>) => Promise<IBookDTO>;
    update: (id: string, value: IUpdateValue<IBookDTO>) => Promise<IBookDTO>;
    remove: (id: string) => Promise<void>;
    get: (id: string) => Promise<IBookDTO>;
    sync: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IBookDTO>[]) => void) => Promise<void>;
    syncBookType: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IBookTypeDTO>[]) => void) => Promise<void>;
}

interface IServices {
    logger: ILogger;
    storage: IStorage;
}
export class BookAPI implements IBookAPI {
    offline: IDBOfflineFirst<IBookDB>;
    offlineBookType: IDBOfflineFirst<IBookTypeDB>;

    constructor(
        dbRemote: {
            book: IDBRemote<IBookDB>;
            bookType: IDBRemote<IBookTypeDB>;
        },
        dbLocal: {
            book: IDBLocal<IBookDB>;
            bookType: IDBLocal<IBookTypeDB>;
        },
        services: IServices,
    ) {
        this.offline = new DBOfflineFirst<IBookDB>(dbRemote.book, dbLocal.book, services);
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

    sync = (args: IQuery | null, callback: (data: ISubscriptionDocument<IBookDTO>[]) => void) => {
        return this.offline.sync(args, callback);
    };

    syncBookType = (args: IQuery | null, callback: (data: ISubscriptionDocument<IBookTypeDTO>[]) => void) => {
        return this.offlineBookType.sync(args, callback);
    };
}
