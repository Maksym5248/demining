import { RANKS } from '~/constants';

import { IRank } from './rank';

export interface IRankValue {
    id: string;
    fullName: string;
    shortName: string;
    rank: RANKS;
}

export const createRank = (rank: IRank): IRankValue => ({
    id: rank.id,
    fullName: String(rank.fullName) || '',
    shortName: String(rank.shortName) || '',
    rank: rank.rank || RANKS.PRIVATE,
});
