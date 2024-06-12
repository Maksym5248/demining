import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { Api, IDocumentDTO } from '~/api';
import { DOCUMENT_TYPE } from '~/constants';
import { CreateValue } from '~/types';
import { dates } from '~/utils';
import { CollectionModel, IRequestModel, ListModel, RequestModel } from '~/utils/models';

import { IDocument, Document, createDocument, createDocumentDTO, IDocumentValue } from './entities';

export interface IDocumentStore {
    collection: CollectionModel<IDocument, IDocumentValue>;
    templatesList: ListModel<IDocument, IDocumentValue>;
    templatesSearchList: ListModel<IDocument, IDocumentValue>;
    missionReportTemplatesList: IDocument[];
    appendTemplates: (res: IDocumentDTO[], isSearch: boolean, isMore?: boolean) => void;
    create: IRequestModel<[CreateValue<IDocumentValue>, File]>;
    remove: IRequestModel<[string]>;
    fetchTemplateItem: IRequestModel<[string]>;
    fetchTemplatesList: IRequestModel<[search?: string]>;
    fetchTemplatesListMore: IRequestModel<[search?: string]>;
}

export class DocumentStore implements IDocumentStore {
    collection = new CollectionModel<IDocument, IDocumentValue>({
        factory: (data: IDocumentValue) => new Document(data),
    });
    templatesList = new ListModel<IDocument, IDocumentValue>({ collection: this.collection });
    templatesSearchList = new ListModel<IDocument, IDocumentValue>({ collection: this.collection });

    constructor() {
        makeAutoObservable(this);
    }

    get missionReportTemplatesList() {
        return this.templatesList.asArray.filter((el) => el.documentType === DOCUMENT_TYPE.MISSION_REPORT);
    }

    appendTemplates(res: IDocumentDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.templatesSearchList : this.templatesList;
        if (isSearch && !isMore) this.templatesSearchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createDocument));
    }

    create = new RequestModel({
        run: async (data: CreateValue<IDocumentValue>, file: File) => {
            const res = await Api.document.create(createDocumentDTO(data), file);
            this.templatesList.unshift(createDocument(res));
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await Api.document.remove(id);
            this.templatesList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => message.success('Видалено успішно'),
        onError: () => message.error('Не вдалось видалити'),
    });

    fetchTemplateItem = new RequestModel({
        run: async (id: string) => {
            const res = await Api.document.get(id);
            this.collection.set(res.id, createDocument(res));
        },
        onError: () => message.error('Виникла помилка'),
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

            const res = await Api.document.getListTemplates({
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

            const value = await Api.document.getListTemplates({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.createdAt),
            });

            this.appendTemplates(value, isSearch, true);
        },
    });
}
