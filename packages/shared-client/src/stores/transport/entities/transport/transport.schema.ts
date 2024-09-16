import { type Dayjs } from 'dayjs';
import { TRANSPORT_TYPE } from 'shared-my';

import { type ITransportDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface ITransportData {
    id: string;
    name: string;
    number: string;
    type: TRANSPORT_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createTransportDTO = (value: ICreateValue<ITransportData>): ICreateValue<ITransportDTO> => ({
    name: value.name,
    number: value.number,
    type: value.type,
});

export const updateTransportDTO = data.createUpdateDTO<ITransportData, ITransportDTO>((value) => ({
    name: value?.name ?? '',
    number: value?.number ?? '',
    type: value?.type ?? TRANSPORT_TYPE.FOR_HUMANS,
}));

export const createTransport = (value: ITransportDTO): ITransportData => ({
    id: value.id,
    name: value.name,
    number: value.number,
    type: value.type,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
