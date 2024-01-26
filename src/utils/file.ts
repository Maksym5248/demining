import { MIME_TYPE } from "~/constants";
import { IMetaData } from "~/types";

async function fileToBlob(template: File, type: MIME_TYPE) {
	const arrayBuffer = await template.arrayBuffer();
	return new Blob([arrayBuffer], { type  });
}

async function fileToBuffer(data: File) {
	const arrayBuffer = await data.arrayBuffer();
	return Buffer.from(arrayBuffer);
}


function bufferToFile(arrayBuffer: Buffer, type: MIME_TYPE, meta: IMetaData ) {
	const blob = new Blob([arrayBuffer], { type });
	return new File([blob], meta.name, meta);
}

function blobToFile(blob: Blob, meta: IMetaData ) {
	return new File([blob], meta.name, meta);
}

function b64toBlob(dataURI:string) {
	const byteString = atob(dataURI.split(',')[1]);
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
    
	for (let i = 0; i < byteString.length; i+=1) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], { type: 'image/jpeg' });
}


export const fileUtils = {
	fileToBlob,
	fileToBuffer,
	bufferToFile,
	b64toBlob,
	blobToFile
}