import { Instance } from 'mobx-state-tree';

import { types } from '../../../../types';

export type IAddress = Instance<typeof Address>;

const Entity = types.model('Address', {
    city: types.maybe(types.string),
    country: types.maybe(types.string),
    district: types.maybe(types.string),
    housenumber: types.maybe(types.string),
    postcode: types.maybe(types.string),
    state: types.maybe(types.string),
    street: types.maybe(types.string),
    municipality: types.maybe(types.string),
});

export const Address = Entity;
