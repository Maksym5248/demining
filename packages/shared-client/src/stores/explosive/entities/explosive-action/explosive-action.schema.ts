import { type DOCUMENT_TYPE } from 'shared-my/db';

import { type IExplosiveActionDTO, type IExplosiveActionDTOParams, type IExplosiveActionSumDTO } from '~/api';

import { type IExplosiveData, createExplosive } from '../explosive/explosive.schema';

export interface IExplosiveActionData extends IExplosiveData {
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

export const createExplosiveActionDTO = (value: IExplosiveActionDataParams): IExplosiveActionDTOParams => ({
    id: value?.id,
    explosiveId: value?.explosiveId,
    quantity: value?.quantity ?? null,
    weight: value?.weight ?? null,
});

export const createExplosiveAction = (value: IExplosiveActionDTO): IExplosiveActionData => ({
    ...createExplosive(value),
    documentType: value?.documentType,
    documentId: value?.documentId,
    explosiveId: value?.explosiveId,
    quantity: value?.quantity ?? undefined,
    weight: value?.weight ?? undefined,
});

export const createExplosiveActionSum = (value: IExplosiveActionSumDTO): IExplosiveActionSumValue => ({
    explosive: value.explosive,
    detonator: value.detonator,
});
