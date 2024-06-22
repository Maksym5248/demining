import { DOCUMENT_TYPE, EQUIPMENT_TYPE } from 'shared-my/db';

import { type IEquipmentActionDTO } from '~/api';
import { data, dates } from '~/common';
import { type ICreateValue } from '~/common';

import { type IEquipmentData, createEquipmentDTO, createEquipment } from '../equipment';

export interface IEquipmentActionData extends IEquipmentData {
    executedAt?: Date;
    equipmentId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;
}

export const createEquipmentActionDTO = (value: ICreateValue<IEquipmentActionData>): ICreateValue<IEquipmentActionDTO> => ({
    ...createEquipmentDTO(value),
    executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
    equipmentId: value?.equipmentId,
    documentType: value?.documentType,
    documentId: value?.documentId,
});

export const updateEquipmentActionDTO = data.createUpdateDTO<IEquipmentActionData, IEquipmentActionDTO>((value) => ({
    executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
    name: value?.name ?? '',
    type: value.type ?? EQUIPMENT_TYPE.MINE_DETECTOR,
    equipmentId: value?.equipmentId ?? '',
    documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
    documentId: value?.documentId ?? '',
}));

export const createEquipmentAction = (value: IEquipmentActionDTO): IEquipmentActionData => ({
    ...createEquipment(value),
    equipmentId: value.equipmentId ?? '',
    documentType: value?.documentType ?? DOCUMENT_TYPE.ORDER,
    documentId: value?.documentId ?? '',
});
