import { type MutableRefObject, useCallback, useMemo, useRef } from 'react';

import { DrawingType, mapUtils } from 'shared-my-client';
import { type ICircle, type ILine, type IPoint, type IPolygon } from 'shared-my-client';

interface IUsePolygonParams {
    isCreating: boolean;
    setCreating: (value: boolean) => void;
    drawing: DrawingType;
    polygon?: IPolygon;
    setPolygon: (value?: IPolygon | undefined) => void;
    setCircle: (value?: ICircle) => void;
    setLine: (value?: ILine | undefined) => void;
    polygons?: IPolygon[];
    circles?: ICircle[];
    isActiveStick: boolean;
    mapRef?: MutableRefObject<google.maps.Map | undefined>;
}

export interface IUsePolygonReturn {
    isVisiblePolygon: boolean;
    isVisiblePolyline: boolean;
    value?: IPolygon;
    onDragEndPolygon: () => void;
    onDragEndPolyline: () => void;
    onLoadPolygon: (newPolygonRef: google.maps.Polygon) => void;
    onLoadPolyline: (newPolylineRef: google.maps.Polyline) => void;
    onClickMap: (e: google.maps.MapMouseEvent) => void;
    clear: () => void;
    onMouseUpPolygon: () => void;
    onMouseUpPolyline: (e: google.maps.MapMouseEvent) => void;
}

export function usePolygon({
    isCreating,
    setCreating,
    drawing,
    polygon,
    setPolygon,
    setCircle,
    setLine,
    polygons,
    isActiveStick,
    mapRef,
}: IUsePolygonParams): IUsePolygonReturn {
    const polygonRef = useRef<google.maps.Polygon>();
    const polylineRef = useRef<google.maps.Polyline>(); // New reference for the polyline

    const onLoadPolygon = useCallback((newPolygonRef: google.maps.Polygon) => {
        polygonRef.current = newPolygonRef;
    }, []);

    const onLoadPolyline = useCallback((newPolylineRef: google.maps.Polyline) => {
        // New function to handle the load event of the polyline
        polylineRef.current = newPolylineRef;
    }, []);

    const getPoint = useCallback(
        (point: IPoint) => {
            if (!isActiveStick || !mapRef?.current || !polygons?.length) {
                return point;
            }

            const closestPointOnPoint = mapUtils.getClosestPointOnPointForPolygons(point, polygons);
            const closestPointOnLine = mapUtils.getClosestPointOnLineForPolygons(point, polygons);

            const pixelDistanceOnPoint = mapUtils.getDistanceByPointsInPixels(point, closestPointOnPoint, mapRef.current) ?? Infinity;
            const pixelDistanceOnLine = mapUtils.getDistanceByPointsInPixels(point, closestPointOnLine, mapRef.current) ?? Infinity;

            if (pixelDistanceOnPoint < 30) {
                return closestPointOnPoint;
            }

            if (pixelDistanceOnLine < 15) {
                return closestPointOnLine;
            }

            return point;
        },
        [isActiveStick, mapRef, polygons],
    );

    const appendPoint = useCallback(
        (value: IPoint) => {
            const point = getPoint(value);

            if (polygon?.points.length) {
                setPolygon({ points: [...polygon.points, point] });
            } else {
                setPolygon({ points: [point] });
            }
        },
        [getPoint, polygon, setPolygon],
    );

    const onDragEndPolygon = useCallback(() => {
        if (!polygonRef.current) return;

        const points = polygonRef.current?.getPath();

        if (!points.getLength()) return;

        const value = points.getArray().map(point => mapUtils.createPointLiteral(point));
        setPolygon({ points: value.map(getPoint) });
    }, [getPoint, setPolygon]);

    const onDragEndPolyline = useCallback(() => {
        if (!polylineRef.current) return;

        const points = polylineRef.current?.getPath();

        if (!points.getLength()) return;

        const value = points.getArray().map(point => mapUtils.createPointLiteral(point));
        setPolygon({ points: value.map(getPoint) });
    }, [getPoint, setPolygon]);

    const clear = useCallback(() => {
        setPolygon(undefined);
    }, []);

    const onClickMap = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (!e?.latLng || drawing !== DrawingType.POLYGON) return;

            const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

            if (!isCreating && !polygon?.points.length) {
                setCreating(true);
                setCircle(undefined);
                setLine(undefined);
            }

            appendPoint(point);
        },
        [appendPoint, drawing, isCreating, polygon?.points.length, setCircle, setCreating, setLine],
    );

    const onMouseUpPolygon = useCallback(() => {
        if (!polygonRef.current) return;

        const path = polygonRef.current.getPath();
        const points = path.getArray().map(point => mapUtils.createPointLiteral(point));

        setPolygon({ points: points.map(getPoint) });
    }, [getPoint, setPolygon]);

    const onMouseUpPolyline = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (!e?.latLng) return;

            const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            const first = polygon?.points[0];

            if (
                drawing === DrawingType.POLYGON &&
                isCreating &&
                !!polygon?.points.length &&
                first?.lat === point.lat &&
                first?.lng === point.lng
            ) {
                setCreating(false);
            } else {
                onDragEndPolyline();
            }
        },
        [drawing, isCreating, onDragEndPolyline, polygon?.points, setCreating],
    );

    const isVisiblePolygon = !!polygon?.points.length && !isCreating;
    const isVisiblePolyline = !!polygon?.points.length && isCreating && drawing === DrawingType.POLYGON;

    return useMemo(
        () => ({
            isVisiblePolygon,
            isVisiblePolyline,
            value: polygon,
            onDragEndPolygon,
            onDragEndPolyline,
            onLoadPolygon,
            onLoadPolyline,
            onClickMap,
            clear,
            onMouseUpPolygon,
            onMouseUpPolyline,
        }),
        [
            clear,
            isVisiblePolygon,
            isVisiblePolyline,
            onClickMap,
            onDragEndPolygon,
            onDragEndPolyline,
            onLoadPolygon,
            onLoadPolyline,
            onMouseUpPolygon,
            onMouseUpPolyline,
            polygon,
        ],
    );
}
