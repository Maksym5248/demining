import { TemplateHandler } from 'easy-template-x';

import { MIME_TYPE } from '~/constants';
import { fileUtils } from '~/utils/file';

const handler = new TemplateHandler();

async function generateFile(template: File, data: {[key:string]: string | number}) {
	const blob = await fileUtils.fileToBlob(template, MIME_TYPE.DOCX);
	const doc = await handler.process(blob, data);
	return doc
}


export const Template = {
	generateFile
}