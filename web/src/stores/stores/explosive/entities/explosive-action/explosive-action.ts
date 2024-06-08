import { Instance, getSnapshot } from 'mobx-state-tree';

import { DOCUMENT_TYPE } from '~/constants';

import { IExplosiveActionValue } from './explosive-action.schema';
import { types } from '../../../../types';
import { Explosive } from '../explosive';

export type IExplosiveAction = Instance<typeof ExplosiveAction>;

const Entity = Explosive.named('ExplosiveAction')
    .props({
        documentType: types.enumeration(Object.values(DOCUMENT_TYPE)),
        documentId: types.string,
        quantity: types.maybe(types.number),
        weight: types.maybe(types.number),
        name: types.string,
        explosiveId: types.string,
    })
    .views((self) => ({
        get value() {
            const { update, ...value } = getSnapshot(self);
            return value;
        },
    }))
    .actions((self) => ({
        updateFields(data: Partial<IExplosiveActionValue>) {
            Object.assign(self, data);
        },
    }));

export const ExplosiveAction = Entity;
