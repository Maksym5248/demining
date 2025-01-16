import { type DOCUMENT_TYPE } from 'shared-my';

import { type IExplosiveActionDTO, type IExplosiveActionDTOParams, type IExplosiveActionSumDTO } from '~/api';

import { type IExplosiveDeviceData, createExplosiveDevice } from '../explosive-device/explosive-device.schema';

export interface IExplosiveDeviceActionData extends IExplosiveDeviceData {
    documentType: DOCUMENT_TYPE;
    documentId: string;
    explosiveId: string;
    quantity?: number;
    weight?: number;
}

export interface IExplosiveActionDataParams {
    id?: string;
    explosiveId: string;
    weight?: number /* in kilograms */;
    quantity?: number;
}

export interface IExplosiveActionSumValue {
    explosive: number;
    detonator: number;
}

export const createExplosiveDeviceActionDTO = (value: IExplosiveActionDataParams): IExplosiveActionDTOParams => ({
    id: value?.id,
    explosiveId: value?.explosiveId,
    quantity: value?.quantity ?? null,
    weight: value?.weight ?? null,
});

export const createExplosiveDeviceAction = (value: IExplosiveActionDTO): IExplosiveDeviceActionData => ({
    ...createExplosiveDevice(value),
    documentType: value?.documentType,
    documentId: value?.documentId,
    explosiveId: value?.explosiveId,
    quantity: value?.quantity ?? undefined,
    weight: value?.weight ?? undefined,
});

export const createExplosiveDeviceActionSum = (value: IExplosiveActionSumDTO): IExplosiveActionSumValue => ({
    explosive: value.explosive,
    detonator: value.detonator,
});
