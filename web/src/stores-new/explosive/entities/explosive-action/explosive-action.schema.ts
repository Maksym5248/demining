import { IExplosiveActionDTO, IExplosiveActionDTOParams, IExplosiveActionSumDTO } from '~/api';
import { DOCUMENT_TYPE } from '~/constants';

import { Explosive } from '../explosive';
import { IExplosiveValue, createExplosive } from '../explosive/explosive.schema';

export interface IExplosiveActionValue extends IExplosiveValue {
    documentType: DOCUMENT_TYPE;
    documentId: string;
    explosiveId: string;
    quantity?: number;
    weight?: number;
}

export type IExplosiveActionValueParams = IExplosiveActionDTOParams;

export interface IExplosiveActionSumValue {
    explosive: number;
    detonator: number;
}

export const createExplosiveActionDTO = (value: IExplosiveActionValueParams): IExplosiveActionDTOParams => ({
    id: value?.id,
    explosiveId: value?.explosiveId,
    quantity: value?.quantity ?? null,
    weight: value?.weight ?? null,
});

export const createExplosiveAction = (value: IExplosiveActionDTO): IExplosiveActionValue => ({
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

export class ExplosiveActionValue extends Explosive implements IExplosiveActionValue {
    documentType: DOCUMENT_TYPE;
    documentId: string;
    explosiveId: string;
    quantity?: number;
    weight?: number;

    constructor(value: IExplosiveActionValue) {
        super(value);
        this.documentType = value.documentType;
        this.documentId = value.documentId;
        this.explosiveId = value.explosiveId;
        this.quantity = value.quantity;
        this.weight = value.weight;
    }
}
