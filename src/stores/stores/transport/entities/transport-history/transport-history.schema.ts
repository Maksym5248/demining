import { CreateValue } from '~/types'
import { TRANSPORT_TYPE } from '~/constants'
import { dates, data } from '~/utils';
import { ITransportHistoryDTO } from '~/api';

import { ITransportValue } from '../transport/transport.schema';

export interface ITransportHistoryValue extends ITransportValue {
  transportId: string;
  missionReportId: string;
}
  
export const createTransportHistoryDTO = (value: CreateValue<ITransportHistoryValue>): CreateValue<ITransportHistoryDTO>  => ({
	name: value.name,
	number: value.number,
	type: value.type,
	transportId: value.transportId,
	missionReportId: value.missionReportId,
});

export const updateTransportHistoryDTO = data.createUpdateDTO<ITransportHistoryValue, ITransportHistoryDTO>(value => ({
	name: value?.name ?? "",
	number: value?.number ?? "",
	type: value?.type ?? TRANSPORT_TYPE.FOR_HUMANS,
	transportId: value?.transportId ?? "",
	missionReportId: value.missionReportId ?? "",
}));

export const createTransportHistory = (value: ITransportHistoryDTO): ITransportHistoryValue => ({
	id: value.id,
	name: value.name,
	number: value.number,
	type: value.type,
	createdAt: dates.create(value.createdAt),
	updatedAt: dates.create(value.updatedAt),
	transportId: value.transportId,
	missionReportId: value.missionReportId,
});
