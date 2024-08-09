import { RANKS } from 'shared-my/db';

import { type IRankDTO } from '~/api';

export interface IRankData {
    id: string;
    fullName: string;
    shortName: string;
    rank: RANKS;
}

export const createRank = (rank: IRankDTO): IRankData => ({
    id: rank.id,
    fullName: String(rank.fullName) || '',
    shortName: String(rank.shortName) || '',
    rank: rank.rank || RANKS.PRIVATE,
});
