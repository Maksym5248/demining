import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { type IExplosiveObjectComponentDTO } from '~/api';

export interface IExplosiveObjectComponentData {
    id: EXPLOSIVE_OBJECT_COMPONENT;
    name: string;
}

export const createExplosiveObjectComponent = (value: IExplosiveObjectComponentDTO): IExplosiveObjectComponentData => ({
    id: value.id,
    name: value.name,
});
