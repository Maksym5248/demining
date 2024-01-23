
import fs from 'fs';

import { STORAGE } from '~/constants';

import { Storage } from './storage/storage';

const TEMPLATE_FILE_NAME = "template/doc-template.doc";

interface IMetaData {
	lastModified: number;
	name: string;
    type: string;
}

const createMetadata = (data:File) => ({
	lastModified: data.lastModified,
	name: data.name,
	type: data.type,
})

async function saveTemplate(data:File): Promise<void> {
	const arrayBuffer = await data.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	await fs.promises.writeFile(TEMPLATE_FILE_NAME, buffer);
	Storage.set(STORAGE.DOC_TEMPLATE, createMetadata(data))
}

async function readTemplate():Promise<File> {
	return new Promise((resolve, reject) => {
		fs.readFile(TEMPLATE_FILE_NAME, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				const metaData = Storage.get(STORAGE.DOC_TEMPLATE) as IMetaData | null;

				if(!metaData){
					throw Error()
				}

				const blob = new Blob([data]);
				const file = new File([blob], metaData.name, metaData);
				resolve(file);
			}
		});
	})
}

async function removeTemplate(){
	await fs.promises.unlink(TEMPLATE_FILE_NAME);

}


export const FileSystem = {
	saveTemplate,
	readTemplate,
	removeTemplate
}