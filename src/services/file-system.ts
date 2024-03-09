
import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import { ASSET_TYPE } from "~/constants";
import { Cache } from "~/utils"


class FileStorageClass {
	organizationId: string = "";

	assetType:ASSET_TYPE;

	cache: Cache = new Cache();

	constructor(assetType: ASSET_TYPE) {
		this.assetType = assetType;
	}

	setOrganizationId(organizationId:string){
		this.organizationId = organizationId;
	}

	getFileRef = (id:string) => {
		const storage = getStorage(getApp());
		return ref(storage, `${this.assetType}/${this.organizationId}/${id}`);
	}

	async save(id: string, data:File): Promise<void> {
		const fileRef = this.getFileRef(id);

		await uploadBytes(fileRef, data);
		this.cache.set(id, data);
	}


	async read(id:string):Promise<File | null> {
		if(this.cache.exist(id)){
			return this.cache.get(id);
		}

		const fileRef = this.getFileRef(id);
		console.log("fileRef", fileRef)
		const url = await getDownloadURL(fileRef);
		console.log("url", url)

		const blob = await fetch(url).then(response => response.blob())

		return new File([blob], id, { type: blob.type });
	}

	async remove(id:string){
		this.cache.remove(id);
		const fileRef = this.getFileRef(id);
		await deleteObject(fileRef)
	}

	async update(id:string, file:File){
		await this.remove(id);
		await this.save(id, file);
		this.cache.set(id, file);
	}

	async saveAsUser(blob: Blob, id:string){
		const blobUrl = URL.createObjectURL(blob);

		let link:HTMLAnchorElement = document.createElement("a");
		link.download = `${id}.docx`;
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
}

export const DocumentStorage = new FileStorageClass(ASSET_TYPE.DOCUMENT)