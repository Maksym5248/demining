import { makeAutoObservable } from 'mobx';
import { DOCUMENT_TYPE } from 'shared-my';

import { type IDocumentAPI } from '~/api';
import { type ICreateValue, dates } from '~/common';
import { CollectionModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IDocument, Document, createDocument, createDocumentDTO, type IDocumentData } from './entities';

export interface IDocumentStore {
    collection: CollectionModel<IDocument, IDocumentData>;
    listTemplates: ListModel<IDocument, IDocumentData>;
    missionReportTemplatesList: IDocument[];
    create: IRequestModel<[ICreateValue<IDocumentData>, File]>;
    remove: IRequestModel<[string]>;
    fetchTemplateItem: IRequestModel<[string]>;
    fetchTemplatesList: IRequestModel<[search?: string]>;
    fetchTemplatesListMore: IRequestModel<[search?: string]>;
}

interface IApi {
    document: IDocumentAPI;
}

interface IServices {
    message: IMessage;
}

export class DocumentStore implements IDocumentStore {
    api: IApi;
    services: IServices;

    collection = new CollectionModel<IDocument, IDocumentData>({
        factory: (data: IDocumentData) => new Document(data, this),
    });

    listTemplates = new ListModel<IDocument, IDocumentData>({ collection: this.collection });

    constructor({ api, services }: { api: IApi; services: IServices }) {
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get missionReportTemplatesList() {
        return this.listTemplates.asArray.filter((el) => el.data.documentType === DOCUMENT_TYPE.MISSION_REPORT);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IDocumentData>, file: File) => {
            const res = await this.api.document.create(createDocumentDTO(data), file);
            this.listTemplates.unshift(createDocument(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.document.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchTemplateItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.document.get(id);
            this.collection.set(res.id, createDocument(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchTemplatesList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.document.getListTemplates({
                search,
                limit: this.listTemplates.pageSize,
            });

            this.listTemplates.set(res.map(createDocument));
        },
    });

    fetchTemplatesListMore = new RequestModel({
        shouldRun: () => this.listTemplates.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.document.getListTemplates({
                search,
                limit: this.listTemplates.pageSize,
                startAfter: dates.toDateServer(this.listTemplates.last.data.createdAt),
            });

            this.listTemplates.push(res.map(createDocument));
        },
    });
}
