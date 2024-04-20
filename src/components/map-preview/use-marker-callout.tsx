import { MutableRefObject, useMemo } from "react";

import { IMarker, IPoint } from "~/types";
import { mapUtils } from "~/utils";

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

	return useMemo(() => mapUtils.getPointByPixelOffset(marker, 150, -150, mapRef?.current, zoom) ?? undefined,
		[marker, mapRef?.current, isVisibleMap, zoom, polygonCallout]);
}