import { IEquipmentActionDTO } from '~/api';
import { DOCUMENT_TYPE, EQUIPMENT_TYPE } from '~/constants';
import { CreateValue } from '~/types';
import { data, dates } from '~/utils';

import { IEquipmentValue, createEquipmentDTO, createEquipment } from '../equipment';

export interface IEquipmentActionValue extends IEquipmentValue {
    executedAt?: Date;
    equipmentId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;
}

export const createEquipmentActionDTO = (
    value: CreateValue<IEquipmentActionValue>,
): CreateValue<IEquipmentActionDTO> => ({
    ...createEquipmentDTO(value),
    executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
    equipmentId: value?.equipmentId,
    documentType: value?.documentType,
    documentId: value?.documentId,
});

export const updateEquipmentActionDTO = data.createUpdateDTO<
    IEquipmentActionValue,
    IEquipmentActionDTO
>((value) => ({
    executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
    name: value?.name ?? '',
    type: value.type ?? EQUIPMENT_TYPE.MINE_DETECTOR,
    equipmentId: value?.equipmentId ?? '',
    documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
    documentId: value?.documentId ?? '',
}));

export const createEquipmentAction = (value: IEquipmentActionDTO): IEquipmentActionValue => ({
    ...createEquipment(value),
    equipmentId: value.equipmentId ?? '',
    documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
    documentId: value?.documentId ?? '',
});
