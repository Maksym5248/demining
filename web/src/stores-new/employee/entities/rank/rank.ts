import { IRankValue, RankValue } from './rank.schema';

export type IRank = IRankValue;

export class Rank extends RankValue implements IRank {
    constructor(data: IRank) {
        super(data);
    }
}
