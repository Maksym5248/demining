import { IExplosiveActionDTO, IExplosiveActionDTOParams, IExplosiveActionSumDTO } from '~/api';
import { DOCUMENT_TYPE } from '~/constants';

import { IExplosiveValue, createExplosive } from '../explosive/explosive.schema';

export interface IExplosiveActionValue extends IExplosiveValue {
	documentType: DOCUMENT_TYPE;
	documentId: string;
	explosiveId: string;
	quantity?: number;
	weight?: number;
}

export interface IExplosiveActionValueParams extends IExplosiveActionDTOParams {}

export interface IExplosiveActionSumValue {
	explosive: number;
	detonator: number;
}

export const createExplosiveActionDTO = (value: IExplosiveActionValueParams): IExplosiveActionDTOParams  => ({
	id: value?.id,
	explosiveId: value?.explosiveId,
	quantity: value?.quantity ?? null,
	weight:value?.weight ?? null,
});

export const createExplosiveAction = (value: IExplosiveActionDTO): IExplosiveActionValue => ({
	...createExplosive(value),
	documentType: value?.documentType,
	documentId: value?.documentId,
	explosiveId: value?.explosiveId,
	quantity: value?.quantity ?? undefined,
	weight:value?.weight ?? undefined,
});

export const createExplosiveActionSum = (value: IExplosiveActionSumDTO): IExplosiveActionSumValue => ({
	explosive: value.explosive,
	detonator: value.detonator,
});
