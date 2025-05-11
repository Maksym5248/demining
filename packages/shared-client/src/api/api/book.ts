import { type IBookTypeDB, type IBookDB } from 'shared-my';

import { type IUpdateValue, type ICreateValue, type ISubscriptionDocument, type IQuery, type IDBRemote } from '~/common';

import { type IBookTypeDTO, type IBookDTO } from '../dto';

export interface IBookAPI {
    getList: (query?: IQuery) => Promise<IBookDTO[]>;
    create: (value: ICreateValue<IBookDTO>) => Promise<IBookDTO>;
    update: (id: string, value: IUpdateValue<IBookDTO>) => Promise<IBookDTO>;
    remove: (id: string) => Promise<void>;
    get: (id: string) => Promise<IBookDTO>;
    subscribe: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IBookDTO>[]) => void) => Promise<void>;
    subscribeBookType: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IBookTypeDTO>[]) => void) => Promise<void>;
}

export class BookAPI implements IBookAPI {
    constructor(
        private db: {
            book: IDBRemote<IBookDB>;
            bookType: IDBRemote<IBookTypeDB>;
        },
    ) {}

    create = async (value: ICreateValue<IBookDTO>): Promise<IBookDTO> => {
        const res = await this.db.book.create(value);

        return res;
    };

    update = async (id: string, value: IUpdateValue<IBookDTO>): Promise<IBookDTO> => {
        const res = await this.db.book.update(id, value);

        return res;
    };

    remove = async (id: string) => {
        await this.db.book.remove(id);
    };

    getList = (query?: IQuery): Promise<IBookDTO[]> =>
        this.db.book.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    get = async (id: string): Promise<IBookDTO> => {
        const res = await this.db.book.get(id);
        if (!res) throw new Error('there is document with id');
        return res;
    };

    subscribe = (args: IQuery | null, callback: (data: ISubscriptionDocument<IBookDTO>[]) => void) => {
        return this.db.book.subscribe(args, callback);
    };

    subscribeBookType = (args: IQuery | null, callback: (data: ISubscriptionDocument<IBookTypeDTO>[]) => void) => {
        return this.db.bookType.subscribe(args, callback);
    };
}
