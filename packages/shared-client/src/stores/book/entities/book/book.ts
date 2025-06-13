import { makeAutoObservable } from 'mobx';
import { LOADING_STATUS } from 'shared-my';

import { type IBookAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type ICollectionModel, type IDataModel, type IRequestModel, RequestModel, CollectionModel } from '~/models';
import { type IMessage } from '~/services';
import {
    BookAssets,
    createBookAssets,
    type IBookAssets,
    type IBookAssetsData,
    type IBookType,
    type IBookTypeData,
    type IViewerStore,
} from '~/stores';

import { type IBookData, createBook, updateBookDTO } from './book.schema';

export interface IBook extends IDataModel<IBookData> {
    displayName: string;
    updateFields(data: Partial<IBookData>): void;
    assets: IBookAssetsData | undefined;
    isEditable: boolean;
    isRemovable: boolean;
    isIdleAssets: boolean;
    isLoadingAssets: boolean;
    isSuccessAssets: boolean;
    isErrorAssets: boolean;
    types: IBookTypeData[];
    update: IRequestModel<[IUpdateValue<IBookData>]>;
    fetchAssetPage: IRequestModel<[number]>;
    createAssets: IRequestModel<[string]>;
    getAssetByPage(page: number): IBookAssets | undefined;
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

interface ICollections {
    bookTypes: ICollectionModel<IBookType, IBookTypeData>;
    bookAssets: ICollectionModel<IBookAssets, IBookAssetsData>;
}

interface IBookParams {
    api: IApi;
    services: IServices;
    getStores: () => IStores;
    collections: ICollections;
}

export class Book implements IBook {
    api: IApi;
    services: IServices;
    data: IBookData;
    getStores: () => IStores;
    collections: ICollections;
    isAssets = false;

    collectionAssets: ICollectionModel<IBookAssets, IBookAssetsData> = new CollectionModel<IBookAssets, IBookAssetsData>({
        factory: (data: IBookAssetsData) => new BookAssets(data),
    });

    constructor(data: IBookData, { api, services, getStores, collections }: IBookParams) {
        this.data = data;

        this.api = api;
        this.services = services;
        this.getStores = getStores;
        this.collections = collections;

        makeAutoObservable(this);
    }

    setLoadingAssetsStatus = (status: LOADING_STATUS) => {
        this.data.assetsStatus = status;
    };

    get id() {
        return this.data.id;
    }

    get assets() {
        return this.collections.bookAssets.get(this.data.id)?.data;
    }

    get displayName() {
        return this.data.name;
    }

    get types() {
        return this.data.type?.map(type => this.collections.bookTypes.get(type)?.data).filter(Boolean) as IBookTypeData[];
    }

    get isIdleAssets() {
        return this.data.assetsStatus === LOADING_STATUS.IDLE;
    }

    get isLoadingAssets() {
        return this.data.assetsStatus === LOADING_STATUS.LOADING;
    }

    get isSuccessAssets() {
        return this.data.assetsStatus === LOADING_STATUS.SUCCESS;
    }

    get isErrorAssets() {
        return this.data.assetsStatus === LOADING_STATUS.ERROR;
    }

    updateFields(data: Partial<IBookData>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IBookData>) => {
            const res = await this.api.book.update(this.data.id, updateBookDTO(data));
            this.updateFields(createBook(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось зберегти, спробуйте ще раз'),
    });

    get isEditable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.dictionary?.editManagement(this.data);
    }

    get isRemovable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.dictionary?.removeManagement(this.data);
    }

    get mapNumberToIds() {
        return this.collectionAssets.asArray.reduce(
            (acc, item) => {
                if (item.data.page) {
                    acc[item.data.page] = item.id;
                }
                return acc;
            },
            {} as Record<number, string>,
        );
    }

    getIdByPage(page: number) {
        return this.mapNumberToIds[page] || '';
    }

    getAssetByPage(page: number) {
        const id = this.getIdByPage(page);
        return this.collectionAssets.get(id);
    }

    fetchAssetPage = new RequestModel({
        run: async (number: number) => {
            try {
                const value = await this.api.book.getAssetPage(this.data.id, number);
                this.collectionAssets.set(value.id, createBookAssets(value));
            } catch (error) {
                if ((error as Error)?.message === 'there is no item with query') {
                    return;
                }

                throw error;
            }
        },
        onError: () => this.services.message.error('Не вдалось завнтажити сторінку'),
    });

    createAssets = new RequestModel({
        run: async () => {
            this.api.book.createAssets(this.data.id);
            this.setLoadingAssetsStatus(LOADING_STATUS.LOADING);
        },
    });
}
