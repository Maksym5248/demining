import { MutableRefObject, useEffect } from "react";

import { ICircle, IMarker, IPoint, IPolygon } from "~/types";
import { mapUtils } from "~/utils";

interface IUseFitBoundsParams {
	marker?: IMarker,
	markerCallout?: IPoint,
	circle?: ICircle,
	polygon?: IPolygon;
	polygonCallout?: IPoint[];
	mapRef?: MutableRefObject<google.maps.Map | undefined>;
	isVisibleMap?: boolean;
}

export function useFitBounds({
	marker,
	markerCallout,
	circle,
	polygon,
	polygonCallout,
	mapRef,
	isVisibleMap
}: IUseFitBoundsParams) {

	useEffect(() => {
		if(!marker && !markerCallout && !circle && !polygon && !polygonCallout) return;
		const bounds = new google.maps.LatLngBounds();
		
		if (marker) bounds.extend(marker);
		if (markerCallout) bounds.extend(markerCallout);
		if (circle) {
			const box = mapUtils.getGeoBoxByZoomOrRadius(circle.center, { radius: circle.radius });
			bounds.extend(box.bottomRight);
			bounds.extend(box.topLeft);
		};
		if (polygon) {
			polygon.points.forEach((point) => {
				bounds.extend(point);
			});
		}
		if (polygonCallout?.length) {
			polygonCallout.forEach((point) => {
				bounds.extend(point);
			});
		}
		  
		mapRef?.current?.fitBounds(bounds, {
			bottom: 0,
			left: 0,
			right: 0,
			top: 20,
		});
	}, [marker, polygon, circle, markerCallout, isVisibleMap, polygonCallout])
}