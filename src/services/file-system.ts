
import fs from 'fs';

import { STORAGE , MIME_TYPE } from '~/constants';
import { fileUtils } from '~/utils/file';

import { Storage } from './storage/storage';

const TEMPLATE_FILE_NAME = "template/doc-template.docx";

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
	const buffer = await fileUtils.fileToBuffer(data);
	await fs.promises.writeFile(TEMPLATE_FILE_NAME, buffer);
	Storage.set(STORAGE.DOC_TEMPLATE, createMetadata(data))
}

async function readTemplate():Promise<File> {
	return new Promise((resolve, reject) => {
		fs.readFile(TEMPLATE_FILE_NAME, (err, data) => {
			if (err) {
				reject(err);
			} else {
				const metaData = Storage.get(STORAGE.DOC_TEMPLATE) as IMetaData | null;

				if(!metaData){
					throw Error()
				}

				resolve(fileUtils.bufferToFile(data, MIME_TYPE.DOCX, metaData));
			}
		});
	})
}

async function removeTemplate(){
	await fs.promises.unlink(TEMPLATE_FILE_NAME);
}

async function saveAsUser(blob: Blob){
	const blobUrl = URL.createObjectURL(blob);

	let link:HTMLAnchorElement = document.createElement("a");
	link.download = "test.docx";
	link.href = blobUrl;

	document.body.appendChild(link);
	link.click();

	setTimeout(() => {
		link.remove();
		window.URL.revokeObjectURL(blobUrl);
		// @ts-expect-error
		link = null;
	}, 0);
}

export const FileSystem = {
	saveTemplate,
	readTemplate,
	removeTemplate,
	saveAsUser,
}