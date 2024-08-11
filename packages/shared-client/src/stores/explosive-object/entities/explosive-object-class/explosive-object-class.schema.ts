import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my/db';

import { type IExplosiveObjectClassDTO } from '~/api';

export interface IExplosiveObjectClassData {
    id: string;
    groupId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    name: string;
}

export const createExplosiveObjectClass = (value: IExplosiveObjectClassDTO): IExplosiveObjectClassData => ({
    id: value.id,
    name: value.name,
    groupId: value.groupId,
    component: value.component,
});
