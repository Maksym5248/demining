import { makeAutoObservable } from 'mobx';

import { type IBookAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IRequestModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IBookData, createBook, updateBookDTO } from './book.schema';

export interface IBook {
    id: string;
    data: IBookData;
    displayName: string;
    updateFields(data: Partial<IBookData>): void;
    update: IRequestModel<[IUpdateValue<IBookData>]>;
}

interface IApi {
    book: IBookAPI;
}

interface IServices {
    message: IMessage;
}

export class Book implements IBook {
    api: IApi;
    services: IServices;
    data: IBookData;

    constructor(data: IBookData, { api, services }: { api: IApi; services: IServices }) {
        this.data = data;

        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
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
}
