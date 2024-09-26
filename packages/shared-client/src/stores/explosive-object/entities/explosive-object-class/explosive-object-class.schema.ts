import { type EXPLOSIVE_OBJECT_CLASS, type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { type IExplosiveObjectClassDTO } from '~/api';

export interface IExplosiveObjectClassData {
    id: string;
    typeId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    name: string;
    class: EXPLOSIVE_OBJECT_CLASS;
}

export const createExplosiveObjectClass = (value: IExplosiveObjectClassDTO): IExplosiveObjectClassData => ({
    id: value.id,
    name: value.name,
    typeId: value.typeId,
    component: value.component,
    class: value.class,
});
