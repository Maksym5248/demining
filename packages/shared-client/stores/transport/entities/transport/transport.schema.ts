import { TRANSPORT_TYPE } from '@/shared/db';
import { type Dayjs } from 'dayjs';

import { type ITransportDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface ITransportValue {
    id: string;
    name: string;
    number: string;
    type: TRANSPORT_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createTransportDTO = (value: ICreateValue<ITransportValue>): ICreateValue<ITransportDTO> => ({
    name: value.name,
    number: value.number,
    type: value.type,
});

export const updateTransportDTO = data.createUpdateDTO<ITransportValue, ITransportDTO>((value) => ({
    name: value?.name ?? '',
    number: value?.number ?? '',
    type: value?.type ?? TRANSPORT_TYPE.FOR_HUMANS,
}));

export const createTransport = (value: ITransportDTO): ITransportValue => ({
    id: value.id,
    name: value.name,
    number: value.number,
    type: value.type,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export class TransportValue {
    id: string;
    name: string;
    number: string;
    type: TRANSPORT_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: ITransportValue) {
        this.id = value.id;
        this.name = value.name;
        this.number = value.number;
        this.type = value.type;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
