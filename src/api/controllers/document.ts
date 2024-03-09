import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'
import { ASSET_TYPE } from '~/constants';
import { DocumentStorage } from '~/services';
import { fileUtils } from '~/utils';

import { IDocumentDTO } from '../types'

const create = async (value: CreateValue<IDocumentDTO>, file:File):Promise<IDocumentDTO> => {
	let res: IDocumentDTO | null = null;

	try {
		res = await DB.document.create(value);
		await DocumentStorage.save(fileUtils.getPath(res.id), file);
	} catch (error) {
		if(res){
			DB.document.remove(res?.id);
		}

		throw error
	}

	return res;
};

const update = async (id:string, value: UpdateValue<IDocumentDTO>, file?:File):Promise<IDocumentDTO> => {
	const res = await DB.document.update(id, value);

	if(file){
		await DocumentStorage.update(id, file);    
	}

	return res;
};

const remove = async (id:string) => {
	await DocumentStorage.remove(fileUtils.getPath(id));
	await DB.document.remove(id)
};

const getListTemplates = ():Promise<IDocumentDTO[]> => DB.document.select({
	where: {
		type: ASSET_TYPE.DOCUMENT,
	}
});

export const document = {
	create,
	update,
	remove,
	getListTemplates
}