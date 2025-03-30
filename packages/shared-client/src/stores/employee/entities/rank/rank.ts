import { type IDataModel } from '~/models';

import { type IRankData } from './rank.schema';

export interface IRank extends IDataModel<IRankData> {}

export class Rank implements IRank {
    data: IRankData;

    constructor(data: IRankData) {
        this.data = data;
    }

    get id() {
        return this.data.id;
    }
}
