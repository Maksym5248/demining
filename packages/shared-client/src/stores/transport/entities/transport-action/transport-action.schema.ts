import { DOCUMENT_TYPE, TRANSPORT_TYPE } from 'shared-my';

import { type ITransportActionDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

import { type ITransportData } from '../transport/transport.schema';

export interface ITransportActionData extends ITransportData {
    executedAt?: Date;
    transportId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;
}

export const createTransportActionDTO = (value: ICreateValue<ITransportActionData>): ICreateValue<ITransportActionDTO> => ({
    name: value.name,
    number: value.number,
    type: value.type,
    transportId: value.transportId,
    executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
    documentType: value.documentType,
    documentId: value.documentId,
});

export const updateTransportActionDTO = data.createUpdateDTO<ITransportActionData, ITransportActionDTO>((value) => ({
    name: value?.name ?? '',
    number: value?.number ?? '',
    type: value?.type ?? TRANSPORT_TYPE.FOR_HUMANS,
    transportId: value?.transportId ?? '',
    executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
    documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
    documentId: value?.documentId ?? '',
}));

export const createTransportAction = (value: ITransportActionDTO): ITransportActionData => ({
    id: value.id,
    name: value.name,
    number: value.number,
    type: value.type,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
    transportId: value.transportId,
    documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
    documentId: value?.documentId ?? '',
});
