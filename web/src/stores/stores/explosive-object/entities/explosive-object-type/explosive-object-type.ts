import { Instance } from 'mobx-state-tree';

import { IExplosiveObjectTypeValue } from './explosive-object-type.schema';
import { types } from '../../../../types';

export type IExplosiveObjectType = Instance<typeof ExplosiveObjectType>;

const Entity = types
    .model('ExplosiveObjectType', {
        id: types.identifier,
        name: types.string,
        fullName: types.string,
    })
    .views((self) => ({
        get displayName() {
            return `${self.name} (${self.fullName})`;
        },
    }))
    .actions((self) => ({
        updateFields(data: Partial<IExplosiveObjectTypeValue>) {
            Object.assign(self, data);
        },
    }));

export const ExplosiveObjectType = Entity;
