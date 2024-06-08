import { MutableRefObject, useEffect } from 'react';

import { ICircle, IMarker, IPoint, IPolygon } from '~/types';
import { mapUtils } from '~/utils';

import { useDebounce } from '../common/useDebounce';

interface IUseFitBoundsParams {
    marker?: IMarker;
    markerCallout?: IPoint;
    circle?: ICircle;
    polygon?: IPolygon;
    polygonCallout?: IPoint[];
    mapRef?: MutableRefObject<google.maps.Map | undefined>;
    isVisibleMap?: boolean;
    isSkip?: boolean;
}

export function useFitBounds({
    marker,
    markerCallout,
    circle,
    polygon,
    polygonCallout,
    mapRef,
    isVisibleMap,
    isSkip,
}: IUseFitBoundsParams) {
    const fitBounds = useDebounce(
        () => {
            if (isSkip) return;

            const bounds = new google.maps.LatLngBounds();

            if (marker) bounds.extend(marker);
            if (markerCallout) bounds.extend(markerCallout);
            if (circle) {
                const box = mapUtils.getGeoBoxByZoomOrRadius(circle.center, {
                    radius: circle.radius,
                });
                bounds.extend(box.bottomRight);
                bounds.extend(box.topLeft);
            }
            if (polygon) {
                polygon.points.forEach((point) => {
                    bounds.extend(point);
                });
            }
            // if (polygonCallout?.length) {
            // 	polygonCallout.forEach((point) => {
            // 		bounds.extend(point);
            // 	});
            // }

            mapRef?.current?.fitBounds(bounds, {
                bottom: 100,
                left: 30,
                right: 30,
                top: 100,
            });
        },
        [marker, polygon, circle, markerCallout, isVisibleMap, polygonCallout],
        1000,
    );

    useEffect(() => {
        if (!marker && !markerCallout && !circle && !polygon && !polygonCallout && !isVisibleMap)
            return;
        fitBounds();
    }, [marker, polygon, circle]);
}
