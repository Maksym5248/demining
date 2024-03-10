import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api } from '~/api'
import { DOCUMENT_TYPE } from '~/constants';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IDocument, IDocumentValue, Document, createDocument, createDocumentDTO } from './entities';

const Store = types
	.model('DocumentStore', {
		collection: createCollection<IDocument, IDocumentValue>("Documents", Document),
		templatesList: createList<IDocument>("DocumentsList", safeReference(Document), { pageSize: 20 }),
	})
	.views((self) => ({
		 get missionReportTemplatesList(){
			return self.templatesList.asArray.filter(el => el.documentType === DOCUMENT_TYPE.MISSION_REPORT);
		}
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IDocumentValue>, file:File) => async function addEmployeeFlow({ flow, self }) {

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

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function addEmployeeFlow({ flow, self }) {
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

const fetchTemplatesList = asyncAction<Instance<typeof Store>>(() => async function addEmployeeFlow({ flow, self }) {
	if(flow.isLoaded){
		return
	}
    
	try {
		flow.start();

		const list = await Api.document.getListTemplates();

		list.forEach((el) => {
			const value = createDocument(el);

			if(!self.collection.has(value.id)){
				self.collection.set(value.id, value);
				self.templatesList.push(value.id);
			}
		})

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const DocumentStore = Store.props({ create, remove, fetchTemplatesList })
