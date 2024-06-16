import { type UpdateValue, type IRequestModel, RequestModel } from '@/shared-client';
import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { Api } from '~/api';
import { fileUtils } from '~/utils/file';

import { DocumentValue, type IDocumentValue, createDocument, updateDocumentDTO } from './document.schema';

export interface IDocument extends IDocumentValue {
    updateFields(data: Partial<IDocumentValue>): void;
    load: IRequestModel<[], File | null>;
    update: IRequestModel<[UpdateValue<IDocumentValue>, File]>;
}

export class Document extends DocumentValue implements IDocument {
    constructor(data: IDocumentValue) {
        super(data);
        makeAutoObservable(this);
    }

    updateFields(data: Partial<IDocumentValue>) {
        Object.assign(this, data);
    }

    load = new RequestModel({
        run: () => Api.document.load(fileUtils.getPath(this.id)),
        onError: () => message.error('Не вдалось увійти, спробуйте ще раз'),
    });

    update = new RequestModel({
        run: async (data: UpdateValue<IDocumentValue>, file: File) => {
            const res = await Api.document.update(this.id, updateDocumentDTO(data), file);
            this.updateFields(createDocument(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось увійти, спробуйте ще раз'),
    });
}
