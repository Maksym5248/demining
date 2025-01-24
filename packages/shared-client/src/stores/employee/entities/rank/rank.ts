import { type IRankData } from './rank.schema';

export interface IRank {
    data: IRankData;
    id: string;
}

export class Rank implements IRank {
    data: IRankData;

    constructor(data: IRankData) {
        this.data = data;
    }

    get id() {
        return this.data.id;
    }
}
