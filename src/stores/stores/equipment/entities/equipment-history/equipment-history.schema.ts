import { CreateValue } from '~/types'
import { data } from '~/utils';
import { IEquipmentHistoryDTO } from '~/api';
import { EQUIPMENT_TYPE } from '~/constants';

import { IEquipmentValue, createEquipmentDTO, createEquipment } from '../equipment';

export interface IEquipmentHistoryValue extends IEquipmentValue {
	equipmentId: string;
	missionReportId: string;
}
  
export const createEquipmentHistoryDTO = (value: CreateValue<IEquipmentHistoryValue>): CreateValue<IEquipmentHistoryDTO>  => ({
	...createEquipmentDTO(value),
	equipmentId: value?.equipmentId,
	missionReportId: value?.missionReportId,
});

export const updateEquipmentHistoryDTO = data.createUpdateDTO<IEquipmentHistoryValue, IEquipmentHistoryDTO>(value => ({
	name: value?.name ?? "",
	type: value.type ?? EQUIPMENT_TYPE.MINE_DETECTOR,
	equipmentId: value?.equipmentId ?? "",
	missionReportId: value?.missionReportId ?? "",
}));

export const createEquipmentHistory = (value: IEquipmentHistoryDTO): IEquipmentHistoryValue => ({
	...createEquipment(value),
	equipmentId: value.equipmentId ?? "",
	missionReportId: value?.missionReportId ?? "",
});
