import { CreateValue } from '~/types'
import { IExplosiveActionDTO, IExplosiveActionDTOParams } from '~/api';
import { DOCUMENT_TYPE } from '~/constants';

import { IExplosiveValue, createExplosive, createExplosiveDTO } from '../explosive/explosive.schema';

export interface IExplosiveActionValue extends IExplosiveValue {
	documentType: DOCUMENT_TYPE;
	documentId: string;
	explosiveId: string;
	quantity?: number;
	weight?: number;
}
export interface IExplosiveActionValueParams extends IExplosiveActionDTOParams {}

export const createExplosiveActionDTO = (value: CreateValue<IExplosiveActionValue>): CreateValue<IExplosiveActionDTO>  => ({
	...createExplosiveDTO(value),
	documentType: value?.documentType,
	documentId: value?.documentId,
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

