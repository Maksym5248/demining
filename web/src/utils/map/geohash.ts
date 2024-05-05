import { geohashQueryBounds } from "geofire-common";

import { IGeoBox, IGeohashRange } from "~/types";

import { getCenterAndRadiusByGeoBox } from "./common";

function getGeohashRangesByGeoBox(geoBox: IGeoBox): IGeohashRange[] {
	const { radius, center } = getCenterAndRadiusByGeoBox(geoBox);
	const bounds = geohashQueryBounds([center.lat, center.lng], radius);
	return bounds.map(bound => ({ start: bound[0], end: bound[1] }));
}


function rangeIsSubset(newRange: IGeohashRange, oldRange: IGeohashRange): boolean {
	return newRange.start >= oldRange.start && newRange.end <= oldRange.end;
}

function rangeIsOverlap(newRange: IGeohashRange, oldRange: IGeohashRange): boolean {
	return newRange.start < oldRange.end && newRange.end > oldRange.start;
}

function adjustRange(newRange: IGeohashRange, oldRange: IGeohashRange): IGeohashRange {
	if (newRange.start < oldRange.end) {
	  return { start: oldRange.end, end: newRange.end };
	}
	return newRange;
}

function getAdjustedRanges(newRanges: IGeohashRange[], oldRanges: IGeohashRange[]): IGeohashRange[] {
	const rangesToLoad = newRanges.filter(newR => !oldRanges.some(oldR => rangeIsSubset(newR, oldR)));
		
	if (!rangesToLoad.length) return [];

	const adjustedRanges = rangesToLoad.map(newR => {
		oldRanges.forEach(oldR => {
			  if (rangeIsOverlap(newR, oldR)) {
				newR = adjustRange(newR, oldR);
			  }
		});
		return newR;
	});

	return adjustedRanges
}

export {
	getGeohashRangesByGeoBox,
	getAdjustedRanges
}