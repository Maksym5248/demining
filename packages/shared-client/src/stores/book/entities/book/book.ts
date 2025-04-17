import { makeAutoObservable } from 'mobx';
import { bookTypesMap, type IBookTypeNotDB } from 'shared-my';

import { type IBookAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IDataModel, type IRequestModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores';

import { type IBookData, createBook, updateBookDTO } from './book.schema';

export interface IBook extends IDataModel<IBookData> {
    displayName: string;
    updateFields(data: Partial<IBookData>): void;
    update: IRequestModel<[IUpdateValue<IBookData>]>;
    isEditable: boolean;
    types: IBookTypeNotDB[];
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

export class Book implements IBook {
    api: IApi;
    services: IServices;
    data: IBookData;
    getStores: () => IStores;

    constructor(data: IBookData, { api, services, getStores }: IBookParams) {
        this.data = data;

        this.api = api;
        this.services = services;
        this.getStores = getStores;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    get types() {
        return this.data.type?.map(type => bookTypesMap[type]).filter(Boolean);
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
        const { permissions } = this.getStores()?.viewer?.user ?? {};
        return !!permissions?.ammo?.edit(this.data);
    }
}
