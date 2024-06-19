import { type IDocumentDB, ASSET_TYPE } from '@/shared/db';

import { type IDBBase, type IQuery, type IUpdateValue, type ICreateValue } from '~/common';
import { fileUtils } from '~/common';
import { type IAssetStorage } from '~/services';

import { type IDocumentDTO } from '../dto';

export interface IDocumentAPI {
    create: (value: ICreateValue<IDocumentDTO>, file: File) => Promise<IDocumentDTO>;
    update: (id: string, value: IUpdateValue<IDocumentDTO>, file?: File) => Promise<IDocumentDTO>;
    remove: (id: string) => Promise<void>;
    getListTemplates: (query?: IQuery) => Promise<IDocumentDTO[]>;
    load: (id: string) => Promise<File | null>;
    get: (id: string) => Promise<IDocumentDTO>;
}

export class DocumentAPI implements IDocumentAPI {
    constructor(
        private db: {
            document: IDBBase<IDocumentDB>;
        },
        private services: {
            assetStorage: IAssetStorage;
        },
    ) {}

    create = async (value: ICreateValue<IDocumentDTO>, file: File): Promise<IDocumentDTO> => {
        let res: IDocumentDTO | null = null;

        try {
            res = await this.db.document.create(value);
            await this.services.assetStorage.document.save(fileUtils.getPath(res.id), file);
        } catch (error) {
            if (res) {
                this.db.document.remove(res?.id);
            }

            throw error;
        }

        return res;
    };

    update = async (id: string, value: IUpdateValue<IDocumentDTO>, file?: File): Promise<IDocumentDTO> => {
        const res = await this.db.document.update(id, value);

        if (file) {
            await this.services.assetStorage.document.update(id, file);
        }

        return res;
    };

    remove = async (id: string) => {
        await this.services.assetStorage.document.remove(fileUtils.getPath(id));
        await this.db.document.remove(id);
    };

    getListTemplates = (query?: IQuery): Promise<IDocumentDTO[]> =>
        this.db.document.select({
            ...(query ?? {}),
            where: {
                ...(query?.where ?? {}),
                type: ASSET_TYPE.DOCUMENT,
            },
            order: {
                by: 'createdAt',
                type: 'desc',
            },
        });

    load = async (id: string) => {
        const file = await this.services.assetStorage.document.read(fileUtils.getPath(id));
        return file;
    };

    get = async (id: string): Promise<IDocumentDTO> => {
        const res = await this.db.document.get(id);
        if (!res) throw new Error('there is document with id');
        return res;
    };
}
