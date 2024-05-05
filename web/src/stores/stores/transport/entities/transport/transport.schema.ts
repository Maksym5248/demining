import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { TRANSPORT_TYPE } from '~/constants'
import { dates, data } from '~/utils';
import { ITransportDTO } from '~/api';

export interface ITransportValue {
  id: string;
  name: string;
  number: string;
  type: TRANSPORT_TYPE;
  createdAt: Dayjs,
  updatedAt: Dayjs,
}
  
export const createTransportDTO = (value: CreateValue<ITransportValue>): CreateValue<ITransportDTO>  => ({
	name: value.name,
	number: value.number,
	type: value.type
});

export const updateTransportDTO = data.createUpdateDTO<ITransportValue, ITransportDTO>(value => ({
	name: value?.name ?? "",
	number: value?.number ?? "",
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
