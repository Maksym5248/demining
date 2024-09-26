import { type IMapViewActionDB } from 'shared-my';

import { type IDBBase } from '~/common';
import { type IGeohashRange } from '~/map';

import { type IMapViewActionDTO } from '../dto';

export interface IMapAPI {
    getByGeohashRanges: (ranges: IGeohashRange[]) => Promise<IMapViewActionDTO[]>;
}

export class MapAPI implements IMapAPI {
    constructor(
        private db: {
            mapViewAction: IDBBase<IMapViewActionDB>;
        },
    ) {}

    getByGeohashRanges = async (ranges: IGeohashRange[]): Promise<IMapViewActionDTO[]> => {
        const promises = ranges.map((b) =>
            this.db.mapViewAction.select({
                order: {
                    by: 'geo.center.hash',
                },
                startAt: b.start,
                endAt: b.end,
            }),
        );

        const res = await Promise.all(promises);
        const matchingDocs: IMapViewActionDTO[] = [];

        res.forEach((snap) => {
            snap.forEach((doc) => {
                matchingDocs.push(doc);
            });
        });

        return matchingDocs;
    };
}
