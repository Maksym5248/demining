import { ASSET_TYPE, DOCUMENT_TYPE, MIME_TYPE } from 'shared-my/db';
import { type Dayjs } from 'dayjs';

import { type IDocumentDTO } from '~/api';
import { data, dates, type ICreateValue } from '~/common';

export interface IDocumentValue {
    id: string;
    name: string;
    type: ASSET_TYPE;
    documentType: DOCUMENT_TYPE;
    mime: MIME_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createDocumentDTO = (value: ICreateValue<IDocumentValue>): ICreateValue<IDocumentDTO> => ({
    name: value.name,
    type: value.type,
    documentType: value.documentType,
    mime: value.mime,
});

export const updateDocumentDTO = data.createUpdateDTO<IDocumentValue, IDocumentDTO>((value) => ({
    name: value?.name ?? '',
    type: value?.type ?? ASSET_TYPE.DOCUMENT,
    documentType: value?.documentType ?? DOCUMENT_TYPE.MISSION_REPORT,
    mime: value?.mime ?? MIME_TYPE.DOCX,
}));

export const createDocument = (value: IDocumentDTO): IDocumentValue => ({
    id: value.id,
    name: value.name,
    type: value.type,
    documentType: value.documentType,
    mime: value.mime,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export class DocumentValue {
    id: string;
    name: string;
    type: ASSET_TYPE;
    documentType: DOCUMENT_TYPE;
    mime: MIME_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: IDocumentValue) {
        this.id = value.id;
        this.name = value.name;
        this.type = value.type;
        this.documentType = value.documentType;
        this.mime = value.mime;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
