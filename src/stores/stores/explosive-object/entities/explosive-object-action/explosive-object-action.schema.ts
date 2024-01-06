import { CreateValue } from '~/types'
import { data } from '~/utils';
import { IExplosiveObjectActionDTO, IExplosiveObjectActionDTOParams } from '~/api';
import { DOCUMENT_TYPE, EXPLOSIVE_OBJECT_CATEGORY } from '~/constants';

import { IExplosiveObjectValue, createExplosiveObject } from '../explosive-object';

export interface IExplosiveObjectActionValue extends IExplosiveObjectValue {
  explosiveObjectId: string;
  documentType: DOCUMENT_TYPE;
  documentId: string;
  quantity: number;
  category: EXPLOSIVE_OBJECT_CATEGORY;
  isDiscovered: boolean;
  isTransported: boolean;
  isDestroyed: boolean;
}

export interface IExplosiveObjectActionValueParams {
  explosiveObjectId: string;
  documentType: DOCUMENT_TYPE;
  documentId: string;
  quantity: number;
  category: EXPLOSIVE_OBJECT_CATEGORY;
  isDiscovered: boolean;
  isTransported: boolean;
  isDestroyed: boolean;
}

  
export const createExplosiveObjectActionDTO = (value: CreateValue<IExplosiveObjectActionValueParams>): CreateValue<IExplosiveObjectActionDTOParams>  => ({
	explosiveObjectId: value?.explosiveObjectId,
	documentType: value.documentType,
	documentId: value.documentId,
	quantity: value.quantity,
	category: value.category,
	isDiscovered: value.isDiscovered,
	isTransported: value.isTransported,
	isDestroyed: value.isDestroyed,
});

export const updateExplosiveObjectActionDTO = data.createUpdateDTO<IExplosiveObjectActionValueParams, IExplosiveObjectActionDTOParams>(value => ({
	explosiveObjectId: value?.explosiveObjectId ?? "",
	documentType: value.documentType ?? DOCUMENT_TYPE.ORDER,
	documentId: value.documentId ?? "",
	quantity: value?.quantity ?? 0,
	category: value?.category ?? EXPLOSIVE_OBJECT_CATEGORY.I,
	isDiscovered: value?.isDiscovered ?? false,
	isTransported: value?.isTransported ?? false,
	isDestroyed: value?.isDestroyed ?? false,
}));

export const createExplosiveObjectAction = (value: IExplosiveObjectActionDTO): IExplosiveObjectActionValue => ({
	...createExplosiveObject(value),
	explosiveObjectId: value.explosiveObjectId,
	documentType: value.documentType,
	documentId: value.documentId,
	quantity: value.quantity,
	category: value.category,
	isDiscovered: value.isDiscovered,
	isTransported: value.isTransported,
	isDestroyed: value.isDestroyed,
});
