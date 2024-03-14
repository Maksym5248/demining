import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { fileUtils } from '~/utils/file';
import { DOCUMENT_TYPE, ASSET_TYPE , MIME_TYPE } from '~/constants';
import { Api } from '~/api';
import { UpdateValue } from '~/types';

import { types } from '../../../../types'
import { asyncAction } from '../../../../utils';
import { IDocumentValue, createDocument, updateDocumentDTO,  } from './document.schema';

export type IDocument= Instance<typeof Document>

const Entity = types.model('Document', {
	id: types.identifier,
	name: types.string,
	type: types.enumeration(Object.values(ASSET_TYPE)),
	documentType: types.enumeration(Object.values(DOCUMENT_TYPE)),
	mime: types.enumeration(Object.values(MIME_TYPE)),
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).actions((self) => ({
	updateFields(data: Partial<IDocumentValue>) {
		Object.assign(self, data);
	}
}));

const load = asyncAction<Instance<typeof Entity>>(() => async function fn({ flow, self }) {
	let file: File | null = null;

	try {
		flow.start();
		file = await Api.document.load(fileUtils.getPath(self.id));
		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось видалити');
	}

	return file;
});

const update = asyncAction<Instance<typeof Entity>>((data: UpdateValue<IDocumentValue>, file:File) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.document.update(self.id, updateDocumentDTO(data), file);    

		self.updateFields(createDocument(res));

		message.success({
			type: 'success',
			content: 'Збережено успішно',
		});
		flow.success();
	} catch (err) {
		flow.failed(err as Error)
		message.error('Не вдалось додати');
	}
});


export const Document = Entity.props({ load, update });