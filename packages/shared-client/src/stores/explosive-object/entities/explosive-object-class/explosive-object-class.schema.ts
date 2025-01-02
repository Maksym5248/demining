import { EXPLOSIVE_OBJECT_CLASS, EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { type IExplosiveObjectClassDTO } from '~/api';
import { data, type ICreateValue } from '~/common';

export interface IExplosiveObjectClassData {
    id: string;
    typeId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    name: string;
    class: EXPLOSIVE_OBJECT_CLASS;
    parentId: string | null;
}

export const createExplosiveObjectClass = (value: IExplosiveObjectClassDTO): IExplosiveObjectClassData => ({
    id: value.id,
    name: value.name,
    typeId: value.typeId,
    component: value.component,
    class: value.class,
    parentId: value.parentId,
});

export const createExplosiveObjectClassDTO = (value: ICreateValue<IExplosiveObjectClassData>): ICreateValue<IExplosiveObjectClassDTO> => ({
    name: value.name,
    typeId: value.typeId,
    component: value.component,
    class: value.class,
    parentId: value.parentId,
});

export const updateExplosiveObjectClassDTO = data.createUpdateDTO<IExplosiveObjectClassData, IExplosiveObjectClassDTO>((value) => ({
    name: value.name ?? '',
    typeId: value.typeId ?? '',
    component: value.component ?? EXPLOSIVE_OBJECT_COMPONENT.AMMO,
    class: value.class ?? EXPLOSIVE_OBJECT_CLASS.PURPOSE,
    parentId: value.parentId ?? '',
}));
