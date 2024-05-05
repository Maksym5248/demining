import { MutableRefObject, useMemo } from "react";

import { IMarker, IPoint } from "~/types";
import { mapUtils, mathUtils } from "~/utils";

interface IUseMarkerCalloutParams {
	marker?: IMarker;
	zoom: number;
	mapRef?: MutableRefObject<google.maps.Map | undefined>;
	isVisibleMap: boolean;
	polygonCallout: IPoint[];
}

export function useMarkerCallout({
	marker,
	zoom,
	mapRef,
	polygonCallout,
	isVisibleMap
}: IUseMarkerCalloutParams) {

	return useMemo(() => {
		if(!marker) return undefined;

		const value = mapUtils.getPointByPixelOffset(marker, 150, -150, mapRef?.current, zoom) ?? undefined;

		return value ? {
			lat: mathUtils.toFixed(value.lat, 9),
			lng: mathUtils.toFixed(value.lng, 9)
		} : undefined;
	},
	[marker, mapRef?.current, isVisibleMap, zoom, polygonCallout]);
}