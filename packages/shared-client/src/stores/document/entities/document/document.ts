import { type IDocumentAPI } from '~/api';
import { type IUpdateValue, fileUtils, customMakeAutoObservable } from '~/common';
import { type IRequestModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { DocumentValue, type IDocumentValue, createDocument, updateDocumentDTO } from './document.schema';

export interface IDocument extends IDocumentValue {
    updateFields(data: Partial<IDocumentValue>): void;
    load: IRequestModel<[], File | null>;
    update: IRequestModel<[IUpdateValue<IDocumentValue>, File]>;
}

interface IApi {
    document: IDocumentAPI;
}

interface IServices {
    message: IMessage;
}

export class Document extends DocumentValue implements IDocument {
    api: IApi;
    services: IServices;

    constructor(data: IDocumentValue, { api, services }: { api: Pick<IApi, 'document'>; services: IServices }) {
        super(data);
        this.api = api;
        this.services = services;

        customMakeAutoObservable(this);
    }

    updateFields(data: Partial<IDocumentValue>) {
        Object.assign(this, data);
    }

    load = new RequestModel({
        run: () => this.api.document.load(fileUtils.getPath(this.id)),
        onError: () => this.services.message.error('Не вдалось увійти, спробуйте ще раз'),
    });

    update = new RequestModel({
        run: async (data: IUpdateValue<IDocumentValue>, file: File) => {
            const res = await this.api.document.update(this.id, updateDocumentDTO(data), file);
            this.updateFields(createDocument(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось увійти, спробуйте ще раз'),
    });
}
