import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { type IDocumentAPI } from '~/api';
import { type IUpdateValue, fileUtils } from '~/common';
import { type IRequestModel, RequestModel } from '~/models';

import { DocumentValue, type IDocumentValue, createDocument, updateDocumentDTO } from './document.schema';

export interface IDocument extends IDocumentValue {
    updateFields(data: Partial<IDocumentValue>): void;
    load: IRequestModel<[], File | null>;
    update: IRequestModel<[IUpdateValue<IDocumentValue>, File]>;
}

interface IApi {
    document: IDocumentAPI;
}

export class Document extends DocumentValue implements IDocument {
    api: Pick<IApi, 'document'>;

    constructor(data: IDocumentValue, { api }: { api: Pick<IApi, 'document'> }) {
        super(data);
        this.api = api;
        makeAutoObservable(this);
    }

    updateFields(data: Partial<IDocumentValue>) {
        Object.assign(this, data);
    }

    load = new RequestModel({
        run: () => this.api.document.load(fileUtils.getPath(this.id)),
        onError: () => message.error('Не вдалось увійти, спробуйте ще раз'),
    });

    update = new RequestModel({
        run: async (data: IUpdateValue<IDocumentValue>, file: File) => {
            const res = await this.api.document.update(this.id, updateDocumentDTO(data), file);
            this.updateFields(createDocument(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось увійти, спробуйте ще раз'),
    });
}
