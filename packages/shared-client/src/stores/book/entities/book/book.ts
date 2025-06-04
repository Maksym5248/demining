import { makeAutoObservable } from 'mobx';

import { type IBookAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type ICollectionModel, type IDataModel, type IRequestModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IBookAssets, type IBookAssetsData, type IBookType, type IBookTypeData, type IViewerStore } from '~/stores';

import { type IBookData, createBook, updateBookDTO } from './book.schema';

export interface IBook extends IDataModel<IBookData> {
    displayName: string;
    updateFields(data: Partial<IBookData>): void;
    assets: IBookAssetsData | undefined;
    update: IRequestModel<[IUpdateValue<IBookData>]>;
    isEditable: boolean;
    isRemovable: boolean;
    types: IBookTypeData[];
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

    constructor(data: IBookData, { api, services, getStores, collections }: IBookParams) {
        this.data = data;

        this.api = api;
        this.services = services;
        this.getStores = getStores;
        this.collections = collections;

        makeAutoObservable(this);
    }

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
}
