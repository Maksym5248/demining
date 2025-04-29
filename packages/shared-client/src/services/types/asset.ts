export interface IAssetStorageBase {
    setRootCollect(rootCollection: string): void;
    removeRootCollect(): void;
    save(id: string, data: File | string): Promise<void>;
    read(id: string): Promise<File | null>;
    remove(id: string): Promise<void>;
    update(id: string, file: File): Promise<void>;
    getFileUrl(id: string): Promise<string>;
    create(file: File | string): Promise<string>;
}

export interface IAssetStorage {
    document: IAssetStorageBase;
    image: IAssetStorageBase;
    setOrganizationId(organizationId: string): void;
    removeOrganizationId(): void;
}
