export interface IAssetStorageBase {
    setRootCollect(rootCollection: string): void;
    removeRootCollect(): void;
    save(id: string, data: File): Promise<void>;
    read(id: string): Promise<File | null>;
    remove(id: string): Promise<void>;
    update(id: string, file: File): Promise<void>;
}

export interface IAssetStorage {
    document: IAssetStorageBase;
    setOrganizationId(organizationId: string): void;
    removeOrganizationId(): void;
}
