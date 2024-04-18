import { useMemo } from "react";

import * as turf from '@turf/turf';

import { IPolygon } from "~/types";
import { mapUtils } from "~/utils";

interface IUsePolygonCalloutParams {
	polygon?: IPolygon;
	zoom: number;
	isVisibleMap: boolean;
	offset: number; // px
}

const opposite = (value:number) => value > 0 ? value - 180 : value + 180

export function usePolygonCallout({
	polygon,
	zoom,
	isVisibleMap,
	offset
}: IUsePolygonCalloutParams) {

	const center = useMemo(() => polygon ? mapUtils.getCenter(polygon) : null, [polygon]);
	
	const callout = useMemo(() => {
		if (!polygon?.points.length || !center) return [];

		const offsetInMeters = mapUtils.pixelsToMeters(offset, zoom);
		const turfPolygon =  turf.polygon([[...polygon.points.map(mapUtils.createArrFromPoint), mapUtils.createArrFromPoint(polygon.points[0])]]);

		const calloutPoints = polygon?.points.map((point, i) => {
			const lastIndex = polygon.points.length - 1;
			const prevIndex = i === 0 ? lastIndex : i - 1;
			const nextIndex = i === lastIndex ? 0 : i + 1;

			const turfPoint = turf.point(mapUtils.createArrFromPoint(point));

			const turfPrev = turf.point(mapUtils.createArrFromPoint(polygon.points[prevIndex]));
			const turfNext = turf.point(mapUtils.createArrFromPoint(polygon.points[nextIndex]));

			const bearingPrev = turf.bearing(turfPoint, turfPrev);
			const bearingNext = turf.bearing(turfPoint, turfNext);

			const bearing = (bearingPrev + bearingNext) / 2;

			const destination = turf.destination(turfPoint, offsetInMeters, bearing, { units: 'meters' });
			const opositeDestination = turf.destination(turfPoint, offsetInMeters, opposite(bearing), { units: 'meters' });

			return turf.booleanPointInPolygon(destination, turfPolygon)
			 ? mapUtils.createPointFromArr(opositeDestination.geometry.coordinates)
			 : mapUtils.createPointFromArr(destination.geometry.coordinates);
		});

		return calloutPoints;
  	}, [polygon?.points, center, offset, zoom, isVisibleMap]);
  
	return callout;
}