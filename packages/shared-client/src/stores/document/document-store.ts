import { makeAutoObservable } from 'mobx';
import { DOCUMENT_TYPE } from 'shared-my/db';

import { type IDocumentAPI, type IDocumentDTO } from '~/api';
import { type ICreateValue, dates } from '~/common';
import { CollectionModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IDocument, Document, createDocument, createDocumentDTO, type IDocumentData } from './entities';

export interface IDocumentStore {
    collection: CollectionModel<IDocument, IDocumentData>;
    templatesList: ListModel<IDocument, IDocumentData>;
    templatesSearchList: ListModel<IDocument, IDocumentData>;
    missionReportTemplatesList: IDocument[];
    appendTemplates: (res: IDocumentDTO[], isSearch: boolean, isMore?: boolean) => void;
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
    templatesList = new ListModel<IDocument, IDocumentData>({ collection: this.collection });
    templatesSearchList = new ListModel<IDocument, IDocumentData>({ collection: this.collection });

    constructor({ api, services }: { api: IApi; services: IServices }) {
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get missionReportTemplatesList() {
        return this.templatesList.asArray.filter((el) => el.data.documentType === DOCUMENT_TYPE.MISSION_REPORT);
    }

    appendTemplates(res: IDocumentDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.templatesSearchList : this.templatesList;
        if (isSearch && !isMore) this.templatesSearchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createDocument));
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IDocumentData>, file: File) => {
            const res = await this.api.document.create(createDocumentDTO(data), file);
            this.templatesList.unshift(createDocument(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.document.remove(id);
            this.templatesList.removeById(id);
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
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.templatesSearchList : this.templatesList;

            return !(!isSearch && list.length);
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.templatesSearchList : this.templatesList;

            const res = await this.api.document.getListTemplates({
                search,
                limit: list.pageSize,
            });

            this.appendTemplates(res, isSearch);
        },
    });

    fetchTemplatesListMore = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.templatesSearchList : this.templatesList;

            return list.isMorePages;
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.templatesSearchList : this.templatesList;

            const value = await this.api.document.getListTemplates({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.data.createdAt),
            });

            this.appendTemplates(value, isSearch, true);
        },
    });
}
