
import { RANKS } from '~/constants';

import { IRank } from './rank';

export const createRank = (rank: IRank): IRank => ({
  id: rank.id,
  fullName: String(rank.fullName) || '',
  shortName: String(rank.shortName) || '',
  rank: rank.rank || RANKS.PRIVATE,
});
