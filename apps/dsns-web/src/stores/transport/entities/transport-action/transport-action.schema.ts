import { type ITransportActionDTO } from '~/api';
import { DOCUMENT_TYPE, TRANSPORT_TYPE } from '~/constants';
import { type CreateValue } from '~/types';
import { dates, data } from '~/utils';

import { type ITransportValue, TransportValue } from '../transport/transport.schema';

export interface ITransportActionValue extends ITransportValue {
    executedAt?: Date;
    transportId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;
}

export const createTransportActionDTO = (value: CreateValue<ITransportActionValue>): CreateValue<ITransportActionDTO> => ({
    name: value.name,
    number: value.number,
    type: value.type,
    transportId: value.transportId,
    executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
    documentType: value.documentType,
    documentId: value.documentId,
});

export const updateTransportActionDTO = data.createUpdateDTO<ITransportActionValue, ITransportActionDTO>((value) => ({
    name: value?.name ?? '',
    number: value?.number ?? '',
    type: value?.type ?? TRANSPORT_TYPE.FOR_HUMANS,
    transportId: value?.transportId ?? '',
    executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
    documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
    documentId: value?.documentId ?? '',
}));

export const createTransportAction = (value: ITransportActionDTO): ITransportActionValue => ({
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

export class TransportActionValue extends TransportValue {
    executedAt?: Date;
    transportId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;

    constructor(value: ITransportActionValue) {
        super(value);

        this.executedAt = value.executedAt;
        this.transportId = value.transportId;
        this.documentType = value.documentType;
        this.documentId = value.documentId;
    }
}
