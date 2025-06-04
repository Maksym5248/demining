import { makeAutoObservable } from 'mobx';

import { type IBookDTO, type IBookAPI, type IBookTypeDTO } from '~/api';
import { type ICreateValue, type ISubscriptionDocument, data, dates } from '~/common';
import { CollectionModel, type ICollectionModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IBook,
    Book,
    createBook,
    createBookDTO,
    type IBookData,
    type IBookTypeData,
    createBookType,
    type IBookType,
    BookType,
    type IBookAssets,
    type IBookAssetsData,
    BookAssets,
    createBookAssets,
} from './entities';
import { getDictionarySync } from '../filter';
import { type IViewerStore } from '../viewer';

export interface IBookStore {
    collection: ICollectionModel<IBook, IBookData>;
    collectionAssets: ICollectionModel<IBookAssets, IBookAssetsData>;
    collectionBookType: ICollectionModel<IBookType, IBookTypeData>;
    list: ListModel<IBook, IBookData>;
    create: IRequestModel<[ICreateValue<IBookData>]>;
    remove: IRequestModel<[string]>;
    fetchItem: IRequestModel<[string]>;
    loadAssetsItem: IRequestModel<[string]>;
    createAssets: IRequestModel<[string]>;
    fetchList: IRequestModel<[search?: string]>;
    fetchListMore: IRequestModel<[search?: string]>;
    sync: RequestModel;
    syncBookType: RequestModel;
}

interface IApi {
    book: IBookAPI;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    viewer?: IViewerStore;
}

interface IBookParams {
    api: IApi;
    services: IServices;
    getStores: () => IStores;
}

export class BookStore implements IBookStore {
    api: IApi;
    services: IServices;
    getStores: () => IStores;

    collectionAssets: ICollectionModel<IBookAssets, IBookAssetsData> = new CollectionModel<IBookAssets, IBookAssetsData>({
        factory: (data: IBookAssetsData) => new BookAssets(data),
    });

    collection: ICollectionModel<IBook, IBookData> = new CollectionModel<IBook, IBookData>({
        factory: (data: IBookData) => new Book(data, this),
    });

    collectionBookType: ICollectionModel<IBookType, IBookTypeData> = new CollectionModel<IBookType, IBookTypeData>({
        factory: (data: IBookTypeData) => new BookType(data),
    });

    collections = {
        book: this.collection,
        bookTypes: this.collectionBookType,
        bookAssets: this.collectionAssets,
    };

    list = new ListModel<IBook, IBookData>({ collection: this.collection });

    constructor({ api, services, getStores }: IBookParams) {
        this.api = api;
        this.services = services;
        this.getStores = getStores;

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

    createAssets = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.book.createBookAssets(id);
            this.collectionAssets.set(res.id, createBookAssets(res));
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

    loadAssetsItem = new RequestModel({
        run: async (id: string) => {
            let res = await this.api.book.getAssets(id);

            if (!res) {
                res = await this.api.book.createBookAssets(id);
            }

            this.collectionAssets.set(res.id, createBookAssets(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.book.getList({
                search,
                ...getDictionarySync(this),
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
                ...getDictionarySync(this),
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createBook));
        },
    });

    sync = new RequestModel({
        run: async () => {
            await this.api.book.sync(getDictionarySync(this), (values: ISubscriptionDocument<IBookDTO>[]) => {
                const { create, update, remove } = data.sortByType<IBookDTO, IBookData>(values, createBook);

                this.list.push(create);
                this.collection.update(update);
                this.collection.remove(remove);
            });
        },
    });

    syncBookType = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            await this.api.book.syncBookType({}, (values: ISubscriptionDocument<IBookTypeDTO>[]) => {
                const create: IBookTypeData[] = [];
                const update: IBookTypeData[] = [];
                const remove: string[] = [];

                values.forEach(value => {
                    if (value.type === 'removed') {
                        remove.push(value.data.id);
                    } else if (value.type === 'added') {
                        create.push(createBookType(value.data));
                    } else if (value.type === 'modified') {
                        update.push(createBookType(value.data));
                    }
                });

                this.collectionBookType.set(create);
                this.collectionBookType.update(update);
                this.collectionBookType.remove(remove);
            });
        },
    });
}
