import { type DOCUMENT_TYPE, EXPLOSIVE_OBJECT_CATEGORY } from 'shared-my';

import { type IExplosiveObjectActionDTO, type IExplosiveObjectActionDTOParams, type IExplosiveObjectActionSumDTO } from '~/api';
import { data } from '~/common';

import { type IExplosiveObjectData, createExplosiveObject } from '../explosive-object';

export interface IExplosiveObjectActionData extends IExplosiveObjectData {
    explosiveObjectId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;
    quantity: number;
    category: EXPLOSIVE_OBJECT_CATEGORY;
    isDiscovered: boolean;
    isTransported: boolean;
    isDestroyed: boolean;
}

export interface IExplosiveObjectActionSumValue {
    total: number;
    discovered: number;
    transported: number;
    destroyed: number;
}

export type IExplosiveObjectActionDataParams = IExplosiveObjectActionDTOParams;

export const createExplosiveObjectActionDTO = (value: IExplosiveObjectActionDataParams): IExplosiveObjectActionDTOParams => ({
    id: value?.id,
    explosiveObjectId: value?.explosiveObjectId,
    quantity: value.quantity,
    category: value.category,
    isDiscovered: value.isDiscovered,
    isTransported: value.isTransported,
    isDestroyed: value.isDestroyed,
});

export const updateExplosiveObjectActionDTO = data.createUpdateDTO<IExplosiveObjectActionDataParams, IExplosiveObjectActionDTOParams>(
    (value) => ({
        explosiveObjectId: value?.explosiveObjectId ?? '',
        quantity: value?.quantity ?? 0,
        category: value?.category ?? EXPLOSIVE_OBJECT_CATEGORY.I,
        isDiscovered: value?.isDiscovered ?? false,
        isTransported: value?.isTransported ?? false,
        isDestroyed: value?.isDestroyed ?? false,
    }),
);

export const createExplosiveObjectAction = (value: IExplosiveObjectActionDTO): IExplosiveObjectActionData => ({
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

export const createExplosiveObjectActionSum = (value: IExplosiveObjectActionSumDTO): IExplosiveObjectActionSumValue => ({
    total: value.total,
    discovered: value.discovered,
    transported: value.transported,
    destroyed: value.destroyed,
});
