import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IDocumentDTO } from '~/api';
import { DOCUMENT_TYPE, ASSET_TYPE, MIME_TYPE } from '~/constants';

export interface IDocumentValue {
  id: string;
  name: string;
  type: ASSET_TYPE;
  documentType: DOCUMENT_TYPE;
  mime: MIME_TYPE;
  createdAt: Dayjs,
  updatedAt: Dayjs,
}
  
export const createDocumentDTO = (value: CreateValue<IDocumentValue>): CreateValue<IDocumentDTO>  => ({
	name: value.name,
	type: value.type,
	documentType: value.documentType,
	mime: value.mime,
});

export const updateDocumentDTO = data.createUpdateDTO<IDocumentValue, IDocumentDTO>(value => ({
	name: value?.name ?? "",
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
