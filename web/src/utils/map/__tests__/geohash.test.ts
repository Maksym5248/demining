import { IGeohashRange } from '~/types';

import { getAdjustedRanges } from '../geohash';

describe('geohash', () => {
    describe('getAdjustedRanges', () => {
        it('returns an empty array when there are no new ranges', () => {
            const newRanges: IGeohashRange[] = [];
            const oldRanges = [
                { start: 'u33', end: 'u34' },
                { start: 'u35', end: 'u36' },
            ];

            const adjustedRanges = getAdjustedRanges(newRanges, oldRanges);

            expect(adjustedRanges).toEqual([]);
        });

        it('returns the new ranges that are not subsets of any old range', () => {
            const newRanges = [
                { start: 'u33', end: 'u34' },
                { start: 'u35', end: 'u36' },
            ];
            const oldRanges = [
                { start: 'u31', end: 'u32' },
                { start: 'u37', end: 'u38' },
            ];

            const adjustedRanges = getAdjustedRanges(newRanges, oldRanges);

            expect(adjustedRanges).toEqual(newRanges);
        });

        it('returns an empty array when a new range is a subset of an old range', () => {
            const newRanges: IGeohashRange[] = [{ start: 'u33', end: 'u34' }];
            const oldRanges: IGeohashRange[] = [{ start: 'u32', end: 'u35' }];

            const adjustedRanges = getAdjustedRanges(newRanges, oldRanges);

            expect(adjustedRanges).toEqual([]);
        });

        it('returns an empty array when a new range is a subset of an old range in a smaller scale', () => {
            const newRanges: IGeohashRange[] = [{ start: 'u33d', end: 'u33f' }];
            const oldRanges: IGeohashRange[] = [{ start: 'u33', end: 'u34' }];

            const adjustedRanges = getAdjustedRanges(newRanges, oldRanges);

            expect(adjustedRanges).toEqual([]);
        });

        it('returns adjusted range when a new range is a subset of an old range in a smaller scale but only overlaps in part of the range', () => {
            const newRanges: IGeohashRange[] = [{ start: 'u33d', end: 'u34b' }];
            const oldRanges: IGeohashRange[] = [{ start: 'u33', end: 'u34' }];

            const adjustedRanges = getAdjustedRanges(newRanges, oldRanges);

            expect(adjustedRanges).toEqual([{ start: 'u34', end: 'u34b' }]);
        });

        it('adjusts the new ranges that overlap with any old range', () => {
            const newRanges = [
                { start: 'u33', end: 'u34' },
                { start: 'u35', end: 'u36' },
            ];
            const oldRanges = [
                { start: 'u32', end: 'u33' },
                { start: 'u34', end: 'u35' },
            ];

            const adjustedRanges = getAdjustedRanges(newRanges, oldRanges);

            expect(adjustedRanges).toEqual([
                { start: 'u33', end: 'u34' },
                { start: 'u35', end: 'u36' },
            ]);
        });

        it('returns an empty array when all new ranges are subsets of old ranges', () => {
            const newRanges = [
                { start: 'u33', end: 'u34' },
                { start: 'u35', end: 'u36' },
            ];
            const oldRanges = [
                { start: 'u32', end: 'u35' },
                { start: 'u34', end: 'u37' },
            ];

            const adjustedRanges = getAdjustedRanges(newRanges, oldRanges);

            expect(adjustedRanges).toEqual([]);
        });
    });
});
