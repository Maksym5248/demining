import { CreateValue } from '~/types'
import { data } from '~/utils';
import { IEquipmentActionDTO } from '~/api';
import { DOCUMENT_TYPE, EQUIPMENT_TYPE } from '~/constants';

import { IEquipmentValue, createEquipmentDTO, createEquipment } from '../equipment';

export interface IEquipmentActionValue extends IEquipmentValue {
	equipmentId: string;
	documentType: DOCUMENT_TYPE;
    documentId: string;
}
  
export const createEquipmentActionDTO = (value: CreateValue<IEquipmentActionValue>): CreateValue<IEquipmentActionDTO>  => ({
	...createEquipmentDTO(value),
	equipmentId: value?.equipmentId,
	documentType: value?.documentType,
	documentId: value?.documentId,
});

export const updateEquipmentActionDTO = data.createUpdateDTO<IEquipmentActionValue, IEquipmentActionDTO>(value => ({
	name: value?.name ?? "",
	type: value.type ?? EQUIPMENT_TYPE.MINE_DETECTOR,
	equipmentId: value?.equipmentId ?? "",
	documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
	documentId: value?.documentId ?? "",
}));

export const createEquipmentAction = (value: IEquipmentActionDTO): IEquipmentActionValue => ({
	...createEquipment(value),
	equipmentId: value.equipmentId ?? "",
	documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
	documentId: value?.documentId ?? "",
});