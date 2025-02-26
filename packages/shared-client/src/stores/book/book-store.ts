import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_OBJECT_STATUS } from 'shared-my';

import { type IBookDTO, type IBookAPI } from '~/api';
import { type ICreateValue, type ISubscriptionDocument, data, dates } from '~/common';
import { CollectionModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IBook, Book, createBook, createBookDTO, type IBookData } from './entities';

export interface IBookStore {
    collection: CollectionModel<IBook, IBookData>;
    list: ListModel<IBook, IBookData>;
    create: IRequestModel<[ICreateValue<IBookData>]>;
    remove: IRequestModel<[string]>;
    fetchItem: IRequestModel<[string]>;
    fetchList: IRequestModel<[search?: string]>;
    fetchListMore: IRequestModel<[search?: string]>;
    subscribe: RequestModel;
}

interface IApi {
    book: IBookAPI;
}

interface IServices {
    message: IMessage;
}

export class BookStore implements IBookStore {
    api: IApi;
    services: IServices;

    collection = new CollectionModel<IBook, IBookData>({
        factory: (data: IBookData) => new Book(data, this),
    });

    list = new ListModel<IBook, IBookData>({ collection: this.collection });

    constructor({ api, services }: { api: IApi; services: IServices }) {
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IBookData>) => {
            const res = await this.api.book.create(createBookDTO(data));
            this.list.unshift(createBook(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.book.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.book.get(id);
            this.collection.set(res.id, createBook(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.book.getList({
                search,
                limit: this.list.pageSize,
            });

            this.list.set(res.map(createBook));
        },
    });

    fetchListMore = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.book.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createBook));
        },
    });

    subscribe = new RequestModel({
        run: async () => {
            await this.api.book.subscribe(
                {
                    where: {
                        status: EXPLOSIVE_OBJECT_STATUS.CONFIRMED,
                    },
                },
                (values: ISubscriptionDocument<IBookDTO>[]) => {
                    const { create, update, remove } = data.sortByType<IBookDTO, IBookData>(values, createBook);

                    this.list.push(create);
                    this.collection.updateArr(update);
                    this.collection.remove(remove);
                },
            );
        },
    });
}
