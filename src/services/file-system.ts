
import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import { DOCX_TEMPLATE } from '~/constants';

import { Storage } from './storage/storage';


const createMetadata = (data:File) => ({
	lastModified: data.lastModified,
	name: data.name,
	type: data.type,
})

async function saveTemplate(name: DOCX_TEMPLATE, data:File): Promise<void> {
	const storage = getStorage(getApp());
	const fileRef = ref(storage, name);

	await uploadBytes(fileRef, data);

	Storage.set(name, createMetadata(data))
}

async function readTemplate(name:DOCX_TEMPLATE):Promise<File | null> {
	const storage = getStorage(getApp());
	const fileRef = ref(storage, name);

	const url = await getDownloadURL(fileRef);
	const blob = await fetch(url).then(response => response.blob())

	return new File([blob], name, { type: blob.type });
}

async function removeTemplate(name:DOCX_TEMPLATE){
	const storage = getStorage();
	const fileRef = ref(storage, name);
	await deleteObject(fileRef)
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