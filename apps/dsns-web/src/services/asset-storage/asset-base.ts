import { getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, deleteObject, getBlob, getDownloadURL } from 'firebase/storage';
import { type ASSET_TYPE } from 'shared-my';
import { Cache } from 'shared-my-client';
import { type IAssetStorageBase } from 'shared-my-client';
import uuid from 'uuid';

export class AssetStorageBase implements IAssetStorageBase {
    rootCollection?: string;

    assetType: ASSET_TYPE;

    cache: Cache = new Cache();

    constructor(assetType: ASSET_TYPE) {
        this.assetType = assetType;
    }

    setRootCollect(rootCollection: string) {
        this.rootCollection = rootCollection;
    }

    removeRootCollect() {
        this.rootCollection = undefined;
    }

    getFileRef = (id: string) => {
        const storage = getStorage(getApp());
        const dirPath = this.rootCollection ? `${this.rootCollection}/${this.assetType}` : `${this.assetType}`;

        return ref(storage, `${dirPath}/${id}`);
    };

    async getFileUrl(id: string): Promise<string> {
        const fileRef = this.getFileRef(id);
        return await getDownloadURL(fileRef);
    }

    async save(id: string, data: File): Promise<void> {
        const fileRef = this.getFileRef(id);

        await uploadBytes(fileRef, data);
        this.cache.set(id, data);
    }

    async read(id: string): Promise<File | null> {
        if (this.cache.exist(id)) {
            return this.cache.get(id);
        }

        const fileRef = this.getFileRef(id);

        const blob = await getBlob(fileRef);

        return new File([blob], id, { type: blob.type });
    }

    async remove(id: string) {
        this.cache.remove(id);
        const fileRef = this.getFileRef(id);
        await deleteObject(fileRef);
    }

    async update(id: string, file: File) {
        await this.remove(id);
        await this.save(id, file);
        this.cache.set(id, file);
    }

    async create(file: File) {
        const id = uuid.v4();
        await this.save(id, file);
        const downloadURL = await this.getFileUrl(id);
        return downloadURL;
    }
}
