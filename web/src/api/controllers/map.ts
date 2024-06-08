import { DB } from '~/db';
import { IGeohashRange } from '~/types';

import { IMapViewActionDTO } from '../types';

const getByGeohashRanges = async (ranges: IGeohashRange[]): Promise<IMapViewActionDTO[]> => {
    const promises = ranges.map((b) =>
        DB.mapViewAction.select({
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

export const map = {
    getByGeohashRanges,
};
