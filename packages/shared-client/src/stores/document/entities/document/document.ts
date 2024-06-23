import { makeAutoObservable } from 'mobx';

import { type IDocumentAPI } from '~/api';
import { type IUpdateValue, fileUtils } from '~/common';
import { type IRequestModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IDocumentData, createDocument, updateDocumentDTO } from './document.schema';

export interface IDocument {
    id: string;
    data: IDocumentData;
    updateFields(data: Partial<IDocumentData>): void;
    load: IRequestModel<[], File | null>;
    update: IRequestModel<[IUpdateValue<IDocumentData>, File]>;
}

interface IApi {
    document: IDocumentAPI;
}

interface IServices {
    message: IMessage;
}

export class Document implements IDocument {
    api: IApi;
    services: IServices;
    data: IDocumentData;

    constructor(data: IDocumentData, { api, services }: { api: IApi; services: IServices }) {
        this.data = data;

        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<IDocumentData>) {
        Object.assign(this.data, data);
    }

    load = new RequestModel({
        run: async () => this.api.document.load(fileUtils.getPath(this.data.id)),
        onError: () => this.services.message.error('Не вдалось увійти, спробуйте ще раз'),
    });

    update = new RequestModel({
        run: async (data: IUpdateValue<IDocumentData>, file: File) => {
            const res = await this.api.document.update(this.data.id, updateDocumentDTO(data), file);
            this.updateFields(createDocument(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось увійти, спробуйте ще раз'),
    });
}
