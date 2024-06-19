import { DOCUMENT_TYPE, EQUIPMENT_TYPE } from '@/shared/db';
import { type Dayjs } from 'dayjs';

import { type IEquipmentActionDTO } from '~/api';
import { data, dates } from '~/common';
import { type ICreateValue } from '~/common';

import { type IEquipmentValue, createEquipmentDTO, createEquipment } from '../equipment';

export interface IEquipmentActionValue extends IEquipmentValue {
    executedAt?: Date;
    equipmentId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;
}

export const createEquipmentActionDTO = (value: ICreateValue<IEquipmentActionValue>): ICreateValue<IEquipmentActionDTO> => ({
    ...createEquipmentDTO(value),
    executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
    equipmentId: value?.equipmentId,
    documentType: value?.documentType,
    documentId: value?.documentId,
});

export const updateEquipmentActionDTO = data.createUpdateDTO<IEquipmentActionValue, IEquipmentActionDTO>((value) => ({
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

export class EquipmentActionValue implements IEquipmentActionValue {
    id: string;
    name: string;
    type: EQUIPMENT_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;
    executedAt?: Date;
    equipmentId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;

    constructor(value: IEquipmentActionValue) {
        this.id = value.id;
        this.name = value.name;
        this.type = value.type;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
        this.executedAt = value.executedAt;
        this.equipmentId = value.equipmentId;
        this.documentType = value.documentType;
        this.documentId = value.documentId;
    }
}
