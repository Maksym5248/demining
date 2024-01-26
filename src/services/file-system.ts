
import fs from 'fs';

import { DOCX_TEMPLATE, MIME_TYPE } from '~/constants';
import { fileUtils } from '~/utils/file';

import { Storage } from './storage/storage';


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

async function saveTemplate(name: DOCX_TEMPLATE, data:File): Promise<void> {
	const buffer = await fileUtils.fileToBuffer(data);
	await fs.promises.writeFile(name, buffer);
	Storage.set(name, createMetadata(data))
}

async function readTemplate(name:DOCX_TEMPLATE):Promise<File> {
	return new Promise((resolve, reject) => {
		fs.readFile(name, (err, data) => {
			if (err) {
				reject(err);
			} else {
				const metaData = Storage.get(name) as IMetaData | null;

				if(!metaData){
					throw Error()
				}

				resolve(fileUtils.bufferToFile(data, MIME_TYPE.DOCX, metaData));
			}
		});
	})
}

async function removeTemplate(name:DOCX_TEMPLATE){
	await fs.promises.unlink(name);
}

async function saveAsUser(blob: Blob, name:string){
	const blobUrl = URL.createObjectURL(blob);

	let link:HTMLAnchorElement = document.createElement("a");
	link.download = `${name}.docx`;
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