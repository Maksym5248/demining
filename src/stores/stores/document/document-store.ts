import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api, IDocumentDTO } from '~/api'
import { DOCUMENT_TYPE } from '~/constants';
import { dates } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IDocument, IDocumentValue, Document, createDocument, createDocumentDTO } from './entities';

const Store = types
	.model('DocumentStore', {
		collection: createCollection<IDocument, IDocumentValue>("Documents", Document),
		templatesList: createList<IDocument>("DocumentsList", safeReference(Document), { pageSize: 10 }),
		templatesSearchList: createList<IDocument>("DocumentsSearchList", safeReference(Document), { pageSize: 10 }),
	})
	.views((self) => ({
		 get missionReportTemplatesList(){
			return self.templatesList.asArray.filter(el => el.documentType === DOCUMENT_TYPE.MISSION_REPORT);
		}
	})).actions(self => ({
		appendTemplates(res: IDocumentDTO[], isSearch: boolean){
			const list = isSearch ? self.templatesSearchList : self.templatesList;

			list.checkMore(res.length);

			res.forEach((el) => {
				const value = createDocument(el);

				self.collection.set(value.id, value);
				if(!list.includes(value.id)) list.push(value.id);
			})
		}
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IDocumentValue>, file:File) => async function fn({ flow, self }) {
	try {
		flow.start();

		const res = await Api.document.create(createDocumentDTO(data), file);

		const value = createDocument(res);

		self.collection.set(value.id, value);
		self.templatesList.unshift(value.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось додати');
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function fn({ flow, self }) {
	try {
		flow.start();
		await Api.document.remove(id);
		self.templatesList.removeById(id);
		self.collection.remove(id);
		flow.success();
		message.success('Видалено успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось видалити');
	}
});

const fetchTemplatesList = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {
	try {
		const isSearch = !!search;
		const list = isSearch ? self.templatesSearchList : self.templatesList

		if(!isSearch && !list.isMorePages) return;

		flow.start();

		const res = await Api.document.getListTemplates({
			search,
			limit: list.pageSize,
		});

		self.appendTemplates(res, isSearch);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

const fetchTemplatesListMore = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {
	try {
		const isSearch = !!search;
		const list = isSearch ? self.templatesSearchList : self.templatesList;

		if(!list.isMorePages) return;

		flow.start();

		const value = await Api.document.getListTemplates({
			search,
			limit: list.pageSize,
			startAfter: dates.toDateServer(list.last.createdAt),
		});

		self.appendTemplates(value, isSearch);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const DocumentStore = Store.props({ create, remove, fetchTemplatesList, fetchTemplatesListMore })
