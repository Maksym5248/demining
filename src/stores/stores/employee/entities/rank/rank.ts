import { types, Instance } from 'mobx-state-tree';

import { RANKS } from '~/constants';

export type IRank = Instance<typeof Rank>

export const Rank = types.model('Rank', {
  id: types.identifier,
  fullName: types.string,
  shortName: types.string,
  rank: types.enumeration(Object.values(RANKS)),
});
