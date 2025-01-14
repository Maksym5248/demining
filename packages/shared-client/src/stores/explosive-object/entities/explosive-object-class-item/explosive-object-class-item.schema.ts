import { EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { type IExplosiveObjectClassItemDTO } from '~/api';
import { data, type ICreateValue } from '~/common';

export interface IExplosiveObjectClassItemData {
    id: string;
    name: string;
    shortName: string;
    classId: string;
    typeId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    parentId: string | null;
}

export const createExplosiveObjectClassItem = (value: IExplosiveObjectClassItemDTO): IExplosiveObjectClassItemData => ({
    id: value.id,
    name: value.name,
    classId: value.classId,
    typeId: value.typeId,
    component: value.component,
    parentId: value.parentId,
    shortName: value.shortName ?? '',
});

export const createExplosiveObjectClassItemDTO = (
    value: ICreateValue<IExplosiveObjectClassItemData>,
): ICreateValue<IExplosiveObjectClassItemDTO> => ({
    name: value.name,
    shortName: value.shortName ?? '',
    classId: value.classId,
    typeId: value.typeId,
    component: value.component,
    parentId: value.parentId,
});

export const updateExplosiveObjectClassItemDTO = data.createUpdateDTO<IExplosiveObjectClassItemData, IExplosiveObjectClassItemDTO>(
    (value) => ({
        name: value.name ?? '',
        shortName: value.shortName ?? '',
        classId: value.classId ?? '',
        typeId: value.typeId ?? '',
        component: value.component ?? EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        parentId: value.parentId ?? null,
    }),
);
