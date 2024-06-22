import { type IRankData } from './rank.schema';

export interface IRank {
    data: IRankData;
}

export class Rank implements IRank {
    data: IRankData;

    constructor(data: IRankData) {
        this.data = data;
    }
}
