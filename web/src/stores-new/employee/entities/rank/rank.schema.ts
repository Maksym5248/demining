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

export class RankValue implements IRankValue {
    id: string;
    fullName: string;
    shortName: string;
    rank: RANKS;

    constructor(data: IRank) {
        this.id = data.id;
        this.fullName = data.fullName;
        this.shortName = data.shortName;
        this.rank = data.rank;
    }
}
