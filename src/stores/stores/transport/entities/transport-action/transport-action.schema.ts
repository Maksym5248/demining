import { CreateValue } from '~/types'
import { DOCUMENT_TYPE, TRANSPORT_TYPE } from '~/constants'
import { dates, data } from '~/utils';
import { ITransportActionDTO } from '~/api';

import { ITransportValue } from '../transport/transport.schema';

export interface ITransportActionValue extends ITransportValue {
  transportId: string;
  documentType: DOCUMENT_TYPE;
  documentId: string;
}
  
export const createTransportActionDTO = (value: CreateValue<ITransportActionValue>): CreateValue<ITransportActionDTO>  => ({
	name: value.name,
	number: value.number,
	type: value.type,
	transportId: value.transportId,
	documentType: value.documentType,
	documentId: value.documentId,
});

export const updateTransportActionDTO = data.createUpdateDTO<ITransportActionValue, ITransportActionDTO>(value => ({
	name: value?.name ?? "",
	number: value?.number ?? "",
	type: value?.type ?? TRANSPORT_TYPE.FOR_HUMANS,
	transportId: value?.transportId ?? "",
	documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
	documentId: value?.documentId ?? "",
}));

export const createTransportAction = (value: ITransportActionDTO): ITransportActionValue => ({
	id: value.id,
	name: value.name,
	number: value.number,
	type: value.type,
	createdAt: dates.create(value.createdAt),
	updatedAt: dates.create(value.updatedAt),
	transportId: value.transportId,
	documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
	documentId: value?.documentId ?? "",
});
