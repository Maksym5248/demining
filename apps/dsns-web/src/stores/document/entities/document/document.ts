import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { Api } from '~/api';
import { type UpdateValue } from '~/types';
import { fileUtils } from '~/utils/file';
import { type IRequestModel, RequestModel } from '~/utils/models';

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
            try {
                const res = await Api.document.update(this.id, updateDocumentDTO(data), file);

                this.updateFields(createDocument(res));

                message.success({
                    type: 'success',
                    content: 'Збережено успішно',
                });
            } catch (err) {
                message.error('Не вдалось додати');
            }
        },
        onError: () => message.error('Не вдалось увійти, спробуйте ще раз'),
    });
}