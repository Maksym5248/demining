import { type Dayjs } from 'dayjs';
import { ASSET_TYPE, DOCUMENT_TYPE, MIME_TYPE } from 'shared-my';

import { type IDocumentDTO } from '~/api';
import { data, dates, type ICreateValue } from '~/common';

export interface IDocumentData {
    id: string;
    name: string;
    type: ASSET_TYPE;
    documentType: DOCUMENT_TYPE;
    mime: MIME_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createDocumentDTO = (value: ICreateValue<IDocumentData>): ICreateValue<IDocumentDTO> => ({
    name: value.name,
    type: value.type,
    documentType: value.documentType,
    mime: value.mime,
});

export const updateDocumentDTO = data.createUpdateDTO<IDocumentData, IDocumentDTO>((value) => ({
    name: value?.name ?? '',
    type: value?.type ?? ASSET_TYPE.DOCUMENT,
    documentType: value?.documentType ?? DOCUMENT_TYPE.MISSION_REPORT,
    mime: value?.mime ?? MIME_TYPE.DOCX,
}));

export const createDocument = (value: IDocumentDTO): IDocumentData => ({
    id: value.id,
    name: value.name,
    type: value.type,
    documentType: value.documentType,
    mime: value.mime,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
